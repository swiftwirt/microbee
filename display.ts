namespace Robot.Display {
    // ─── UTILITY DISPLAY ─────────────────────────────────────────────────────────
    let lastDisplayType = "";
    let lastDisplayValue = -1;

    export function showArrowIfChanged(a: ArrowNames) {
        if (lastDisplayType !== "arrow" || lastDisplayValue !== a) {
            basic.showArrow(a);
            lastDisplayType = "arrow";
            lastDisplayValue = a;
        }
    }

    export function showIconIfChanged(i: IconNames) {
        if (lastDisplayType !== "icon" || lastDisplayValue !== i) {
            basic.showIcon(i);
            lastDisplayType = "icon";
            lastDisplayValue = i;
        }
    }
}

namespace Robot.Observer {
    let cpuTemp = 0;
    let lastCpuTemp = -999;
    let lastFront = -1;
    let lastBack = -1;

    export function sendTelemetry() {
        cpuTemp = input.temperature();

        const changed =
            cpuTemp !== lastCpuTemp ||
            Robot.Sonar.frontDistance !== lastFront ||
            Robot.Sonar.backDistance !== lastBack;

        if (!changed) return;

        lastCpuTemp = cpuTemp;
        lastFront = Robot.Sonar.frontDistance;
        lastBack = Robot.Sonar.backDistance;

        let p = {
            cpu: cpuTemp,
            front: Robot.Sonar.frontDistance,
            back: Robot.Sonar.backDistance
        };

        bluetooth.uartWriteString(JSON.stringify(p) + "\n");
    }
}