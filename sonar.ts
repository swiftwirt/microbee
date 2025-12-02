namespace Robot.Sonar {
    export let frontDistance = 0;
    export let backDistance = 0;

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
        if (Robot.State.sensorConfig.front_distance_enabled) {
            frontDistance = retryPing(Robot.Config.PIN_SONAR_FRONT_TRIG, Robot.Config.PIN_SONAR_FRONT_ECHO);
        } else {
            frontDistance = -1;
        }

        if (Robot.State.sensorConfig.back_distance_enabled) {
            backDistance = retryPing(Robot.Config.PIN_SONAR_BACK_TRIG, Robot.Config.PIN_SONAR_BACK_ECHO);
        } else {
            backDistance = -1;
        }

        if (
            (Robot.Motion.currentDir > 0 && frontDistance !== -1 && frontDistance < Robot.Motion.getCurrentFrontSafeDistance()) ||
            (Robot.Motion.currentDir < 0 && backDistance !== -1 && backDistance < Robot.Motion.getCurrentBackSafeDistance())
        ) {
            Robot.Motion.stop();
        }
        basic.pause(Robot.Config.SONAR_INTERVAL_MS);
    });
}
