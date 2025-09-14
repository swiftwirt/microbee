namespace Robot.Dispatcher {
    export function dispatch(cmd: string) {
        // Try to parse as JSON settings message first
        if (!tryParseSettingsMessage(cmd)) {
            // Handle existing numeric commands
            executeCmd(cmd)
        }
    }

    // ─── SETTINGS MESSAGE HANDLING ──────────────────────────────────────────────
    function tryParseSettingsMessage(cmd: string): boolean {
        try {
            // Try to parse as JSON
            const parsed = JSON.parse(cmd);

            // format: {"l":X,"r":Y,"f":Z,"b":W}
            if (parsed && typeof parsed === "object") {
                let processed = false;

                // Process motor speeds if both are provided
                if (typeof parsed.l === "number" && typeof parsed.r === "number") {
                    const leftSpeed = parsed.l;
                    const rightSpeed = parsed.r;

                    // Validate and apply motor speeds
                    if (leftSpeed >= 0 && leftSpeed <= 1023 && rightSpeed >= 0 && rightSpeed <= 1023) {
                        Robot.Motion.setMotorSpeeds(leftSpeed, rightSpeed);
                        processed = true;
                    }
                }

                // Process safe distances if both are provided
                if (typeof parsed.f === "number" && typeof parsed.b === "number") {
                    const frontDistance = parsed.f;
                    const backDistance = parsed.b;

                    basic.showString(frontDistance, 100);
                    basic.showString(backDistance, 100);

                    // Validate and apply safe distances (20-100cm range)
                    if (frontDistance >= 20 && frontDistance <= 100 && backDistance >= 5 && backDistance <= 200) {
                        Robot.Motion.setSafeDistances(frontDistance, backDistance);
                        processed = true;
                    }
                }

                return processed;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    function executeCmd(cmd: string) {
        switch (cmd) {
            case "1": Robot.Motion.forward(); break;
            case "2": Robot.Motion.backward(); break;
            case "3": Robot.Motion.spinLeft(); break;
            case "4": Robot.Motion.spinRight(); break;
            case "5": Robot.Motion.turnLeft(); break;
            case "6": Robot.Motion.turnRight(); break;
            case "7": Robot.Motion.turnLeftBackward(); break;
            case "8": Robot.Motion.turnRightBackward(); break;
            default: Robot.Motion.stop(); break;
        }
    }
}