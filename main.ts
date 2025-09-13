// ─── STATE ───────────────────────────────────────────────────────────────────
let connected = false;
let isReturning = false;

basic.forever(function () {
    if (connected) Robot.Observer.sendTelemetry();
    basic.pause(1000);
});