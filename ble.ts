namespace Robot.Bluetooth {
    // ─── BLUETOOTH UART SETUP ───────────────────────────────────────────────────
    const TX_POWER_MAX = 7;
    const NEWLINE = serial.delimiters(Delimiters.NewLine);

    bluetooth.startUartService();
    bluetooth.setTransmitPower(TX_POWER_MAX);

    bluetooth.onBluetoothConnected(() => {
        connected = true;
        isReturning = false;
        Robot.Display.showIconIfChanged(IconNames.Heart);
    });

    bluetooth.onBluetoothDisconnected(() => {
        connected = false;
        Robot.Display.showIconIfChanged(IconNames.Skull);
    });

    bluetooth.onUartDataReceived(NEWLINE, () => {
        let cmd = bluetooth.uartReadUntil(NEWLINE).trim();
        Robot.Dispatcher.dispatch(cmd);
    });
}