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

            // format: {"sf":X,"sb":Y} or {"df":Z,"db":W} or parts thereof
            if (parsed && typeof parsed === "object") {
                let processed = false;

                // Process motor speeds individually
                if (typeof parsed.sf === "number") {
                    Robot.Motion.setSpeedForward(parsed.sf);
                    processed = true;
                }
                if (typeof parsed.sb === "number") {
                    Robot.Motion.setSpeedBackward(parsed.sb);
                    processed = true;
                }

                // Process safe distances individually
                if (typeof parsed.df === "number") {
                    Robot.Motion.setSafeDistanceFront(parsed.df);
                    processed = true;
                }
                if (typeof parsed.db === "number") {
                    Robot.Motion.setSafeDistanceBack(parsed.db);
                    processed = true;
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
