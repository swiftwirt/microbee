// ─── STARTUP GREETING (only once at launch) ─────────────────────────────────
basic.showIcon(IconNames.Heart);
basic.pause(200);
basic.showIcon(IconNames.SmallHeart);
basic.pause(200);
basic.showIcon(IconNames.Heart);
basic.pause(200);
basic.showIcon(IconNames.SmallHeart);
basic.pause(200);
basic.showIcon(IconNames.Heart);
soundExpression.giggle.playUntilDone();

// Init Telemetry Sensors
Robot.Telemetry.init();

Robot.Display.showIconIfChanged(IconNames.Happy);

basic.forever(function () {
    if (Robot.State.isConnected()) Robot.Telemetry.sendTelemetry();
    basic.pause(Robot.Config.TELEMETRY_INTERVAL_MS);
});