namespace Robot.Bluetooth {
    const TX_POWER_MAX = 7;
    const NEWLINE = serial.delimiters(Delimiters.NewLine);

    bluetooth.startUartService();
    bluetooth.setTransmitPower(TX_POWER_MAX);

    bluetooth.onBluetoothConnected(() => {
        Robot.State.setConnected(true);
        Robot.Display.showIconIfChanged(IconNames.Heart);
    });

    bluetooth.onBluetoothDisconnected(() => {
        Robot.State.setConnected(false);
        // Heartbeat animation (same as startup)
        basic.showIcon(IconNames.Heart);
        basic.pause(200);
        basic.showIcon(IconNames.SmallHeart);
        basic.pause(200);
        basic.showIcon(IconNames.Heart);
        basic.pause(200);
        basic.showIcon(IconNames.SmallHeart);
        basic.pause(200);
        basic.showIcon(IconNames.Heart);
    });

    bluetooth.onUartDataReceived(NEWLINE, () => {
        let cmd = bluetooth.uartReadUntil(NEWLINE).trim();
        Robot.Dispatcher.dispatch(cmd);
    });
}