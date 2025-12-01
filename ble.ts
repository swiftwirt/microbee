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
        // Cool disconnect animation
        basic.showIcon(IconNames.Sad);
        soundExpression.sad.play();
        basic.pause(300);
        basic.showIcon(IconNames.Asleep);
        basic.pause(300);
        basic.showIcon(IconNames.Confused);
        basic.pause(300);
        Robot.Display.showIconIfChanged(IconNames.Skull);
    });

    bluetooth.onUartDataReceived(NEWLINE, () => {
        let cmd = bluetooth.uartReadUntil(NEWLINE).trim();
        Robot.Dispatcher.dispatch(cmd);
    });
}