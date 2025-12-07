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

// ─── CONCURRENCY MODEL ──────────────────────────────────────────────────────
// This project uses multiple basic.forever() loops for concurrent operations:
// 1. Telemetry loop (below) - runs every 1000ms, sends sensor data
// 2. Sonar loop (sonar.ts) - runs every 80ms, monitors distances & safety stops
// 3. Bluetooth handler (ble.ts) - event-driven, processes commands
//
// MicroBit uses cooperative multitasking, so basic.pause() yields control.
// The loops are designed to be non-blocking and avoid conflicts through:
// - Atomic flag checks (motorsRunning, isConnected)
// - Conditional updates (showIconIfChanged, showArrowIfChanged)
// - Appropriate pause intervals to prevent starvation

basic.forever(function () {
    if (Robot.State.isConnected()) Robot.Telemetry.sendTelemetry();
    basic.pause(Robot.Config.TELEMETRY_INTERVAL_MS);
});