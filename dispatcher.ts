namespace Robot.Dispatcher {
    export function dispatch(cmd: string) {
        // Fast-path: Check if command looks like JSON before expensive parsing
        // Numeric commands ("1", "2", etc.) are handled immediately
        if (cmd.length > 0 && cmd.charAt(0) === "{") {
            // Only attempt JSON parsing for commands starting with '{'
            if (!tryParseSettingsMessage(cmd)) {
                executeCmd(cmd);
            }
        } else {
            // Handle numeric commands directly (most common case)
            executeCmd(cmd);
        }
    }

    // ─── SETTINGS MESSAGE HANDLING ──────────────────────────────────────────────
    function tryParseSettingsMessage(cmd: string): boolean {
        try {
            // Parse as JSON (only called for commands starting with '{')
            const parsed = JSON.parse(cmd);

            // format: {"sf":X,"sb":Y} or {"df":Z,"db":W}
            if (parsed && typeof parsed === "object") {
                let processed = false;

                // Process motor speeds if both are provided
                if (typeof parsed.sf === "number" && typeof parsed.sb === "number") {
                    const speedFront = parsed.sf;
                    const speedBack = parsed.sb;

                    // Validate and apply motor speeds
                    if (speedFront >= 0 && speedFront <= Robot.Config.MAX_MOTOR_SPEED &&
                        speedBack >= 0 && speedBack <= Robot.Config.MAX_MOTOR_SPEED) {
                        Robot.Motion.setSpeeds(speedFront, speedBack);
                        processed = true;
                    }
                }

                // Process safe distances if both are provided
                if (typeof parsed.df === "number" && typeof parsed.db === "number") {
                    const frontDistance = parsed.df;
                    const backDistance = parsed.db;

                    // Validate and apply safe distances (20-100cm range)
                    // We keep these explicit ranges as they might be protocol-specific limits
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
