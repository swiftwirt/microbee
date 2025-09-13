// Sonar Sensors (Digital I/O):
//   P16:  Front sonar trigger
//   P8:  Front sonar echo
//   P1:  Back sonar trigger
//   P2:  Back sonar echo

namespace Robot.Sonar {
    // ─── SONAR PING WITH RETRY ───────────────────────────────────────────────────
    const SONAR_RETRY = 2;
    const SENSOR_INTERVAL_MS = 80;

    export let frontDistance = 0;
    export let backDistance = 0;

    function retryPing(trigger: DigitalPin, echo: DigitalPin): number {
        let d = sonar.ping(trigger, echo, PingUnit.Centimeters);
        for (let i = 0; d === 0 && i < SONAR_RETRY; i++) {
            basic.pause(5);
            basic.pause(0);  // yield to scheduler
            d = sonar.ping(trigger, echo, PingUnit.Centimeters);
        }
        return d || 999;
    }

    basic.forever(function () {
        frontDistance = retryPing(DigitalPin.P16, DigitalPin.P8);
        backDistance = retryPing(DigitalPin.P1, DigitalPin.P2);
        if (
            (Robot.Motion.currentDir > 0 && frontDistance < Robot.Motion.SAFE_DISTANCE) ||
            (Robot.Motion.currentDir < 0 && backDistance < Robot.Motion.SAFE_DISTANCE)
        ) {
            Robot.Motion.stop();
        }
        basic.pause(SENSOR_INTERVAL_MS);
    });
}