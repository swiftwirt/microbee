// ─── STATE ───────────────────────────────────────────────────────────────────
let connected = false;

Robot.Display.showIconIfChanged(IconNames.Happy);

basic.forever(function () {
    if (connected) Robot.Observer.sendTelemetry();
    basic.pause(1000);
});