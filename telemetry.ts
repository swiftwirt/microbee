namespace Robot.Telemetry {
    // ───────────────── TELEMETRY STATE ─────────────────
    let lastCpuTemp = -999;
    let lastBattery = -1;
    let lastFront = -1;
    let lastBack = -1;
    let lastAmbient = -999;
    let lastHumidity = -1;
    let lastAirQuality = -1;
    let lastPressure = -1;
    let lastUvLevel = -1;
    let telemetryMessageId = 0;

    let bme680Ready = false;


    function readBatteryVoltage(): number {
        // Implement real voltage reading if needed
        return -1;
    }

    // ───── PUBLIC STARTUP ─────
    export function init() {
        bme680Ready = Robot.Drivers.BME680.init();
    }

    // ───── SEND TELEMETRY ─────
    export function sendTelemetry() {
        if (!bme680Ready) {
            bme680Ready = Robot.Drivers.BME680.init();
        }

        // Gather Data
        let cpuTemp = input.temperature();
        let battery = readBatteryVoltage();
        let front = Robot.Sonar.frontDistance;
        let back = Robot.Sonar.backDistance;

        let bme = Robot.Drivers.BME680.readSample();
        let ambient = bme.ambient;
        let humidity = bme.humidity;
        let pressure = bme.pressure;
        let airQuality = -1; // Disabled

        // Check for changes
        const changed =
            cpuTemp !== lastCpuTemp ||
            battery !== lastBattery ||
            front !== lastFront ||
            back !== lastBack ||
            ambient !== lastAmbient ||
            humidity !== lastHumidity ||
            airQuality !== lastAirQuality ||
            pressure !== lastPressure;

        if (!changed) return;

        // Update State
        lastCpuTemp = cpuTemp;
        lastBattery = battery;
        lastFront = front;
        lastBack = back;
        lastAmbient = ambient;
        lastHumidity = humidity;
        lastAirQuality = airQuality;
        lastPressure = pressure;
        lastUvLevel = -1;

        // Build Payload
        let p: any = { cpu: cpuTemp };
        if (battery >= 0) p.battery = battery;
        if (front >= 0) p.front = front;
        if (back >= 0) p.back = back;
        if (ambient > -999) p.ambient = ambient;
        if (humidity >= 0) p.humidity = humidity;
        if (airQuality >= 0) p.airQuality = airQuality;
        if (pressure >= 0) p.atmospherePressure = pressure;
        // if (uvLevel >= 0) p.uvLevel = uvLevel;

        // Send
        Robot.DataTransfer.sendChunkedData(JSON.stringify(p), telemetryMessageId);
        telemetryMessageId = (telemetryMessageId + 1) & 0xffff;
    }
}