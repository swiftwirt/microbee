namespace Robot.Dispatcher {
    export function dispatch(cmd: string) {
        if (!isReturning) {
            // Try to parse as JSON settings message first
            if (!tryParseSettingsMessage(cmd)) {
                // Handle existing numeric commands
                executeCmd(cmd)
            }
        }
    }

    // ─── SETTINGS MESSAGE HANDLING ──────────────────────────────────────────────
    function tryParseSettingsMessage(cmd: string): boolean {
        try {

            // Try to parse as JSON
            const parsed = JSON.parse(cmd);

            // format: {"l":X,"r":Y}
            if (parsed && typeof parsed === "object") {
                let leftSpeed: number | undefined;
                let rightSpeed: number | undefined;

                // Check new format first: {"l":X,"r":Y}
                if (typeof parsed.l === "number" && typeof parsed.r === "number") {
                    leftSpeed = parsed.l;
                    rightSpeed = parsed.r;
                }

                // If we have valid speeds, apply them
                if (leftSpeed !== undefined && rightSpeed !== undefined) {
                    // Validate speed ranges before applying
                    if (leftSpeed < 0 || leftSpeed > 1023 ||
                        rightSpeed < 0 || rightSpeed > 1023) {
                    }

                    // Apply motor speeds using motion control
                    Robot.Motion.setMotorSpeeds(leftSpeed, rightSpeed);
                    // basic.showIcon(IconNames.Yes);
                    return true; // Successfully handled
                }
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