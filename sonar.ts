namespace Robot.Sonar {
    export let frontDistance = 0;
    export let backDistance = -1; // single-sonar build: back sonar disabled

    function retryPing(trigger: DigitalPin, echo: DigitalPin): number {
        let d = sonar.ping(trigger, echo, PingUnit.Centimeters);
        for (let i = 0; d === 0 && i < Robot.Config.SONAR_RETRY_COUNT; i++) {
            basic.pause(5);
            basic.pause(0); // yield
            d = sonar.ping(trigger, echo, PingUnit.Centimeters);
        }
        return d || 999;
    }

    basic.forever(function () {
        frontDistance = retryPing(Robot.Config.PIN_SONAR_FRONT_TRIG, Robot.Config.PIN_SONAR_FRONT_ECHO);

        if (Robot.Motion.currentDir > 0 && frontDistance < Robot.Motion.getCurrentFrontSafeDistance()) {
            Robot.Motion.stop();
        }
        basic.pause(Robot.Config.SONAR_INTERVAL_MS);
    });
}
