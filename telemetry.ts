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

    // ───── UV SENSOR CALIBRATION ─────
    let uvBaseline = 0;

    function calibrateUvBaseline() {
        let sum = 0;
        let samples = 20;
        for (let i = 0; i < samples; i++) {
            sum += pins.analogReadPin(Robot.Config.PIN_UV_SENSOR);
            basic.pause(20);
        }
        uvBaseline = Math.idiv(sum, samples);
    }

    function readUvLevel(): number {
        const raw = pins.analogReadPin(Robot.Config.PIN_UV_SENSOR);
        let corrected = raw - uvBaseline;
        if (corrected < 0) corrected = 0;

        let span = 1023 - uvBaseline;
        if (span <= 0) span = 1;

        let uv = Math.idiv(corrected * 11, span);
        return Math.max(0, Math.min(11, uv));
    }

    function readBatteryVoltage(): number {
        // Implement real voltage reading if needed
        return -1;
    }

    // ───── PUBLIC STARTUP ─────
    export function init() {
        calibrateUvBaseline();
        bme680Ready = Robot.Drivers.BME680.init();
    }

    // ───── SEND TELEMETRY ─────
    export function sendTelemetry() {
        const config = Robot.State.sensorConfig;
        const bmeEnabled = config.air_enabled || config.ambient_enabled || config.humidity_enabled || config.pressure_enabled;

        if (bmeEnabled && !bme680Ready) {
            bme680Ready = Robot.Drivers.BME680.init();
        }

        // Gather Data
        let cpuTemp = config.cpu_enabled ? input.temperature() : -999;
        let battery = config.battery_enabled ? readBatteryVoltage() : -1;
        let front = config.front_distance_enabled ? Robot.Sonar.frontDistance : -1;
        let back = config.back_distance_enabled ? Robot.Sonar.backDistance : -1;

        let ambient = -999;
        let humidity = -1;
        let pressure = -1;
        let airQuality = -1;

        if (bmeEnabled && bme680Ready) {
            let bme = Robot.Drivers.BME680.readSample();
            if (config.ambient_enabled) ambient = bme.ambient;
            if (config.humidity_enabled) humidity = bme.humidity;
            if (config.pressure_enabled) pressure = bme.pressure;
            // airQuality is manually disabled in code as -1, but if we had it:
            // if (config.air_enabled) airQuality = ...; 
        }

        let uvLevel = config.uv_enabled ? readUvLevel() : -1;

        // Check for changes
        const changed =
            cpuTemp !== lastCpuTemp ||
            battery !== lastBattery ||
            front !== lastFront ||
            back !== lastBack ||
            ambient !== lastAmbient ||
            humidity !== lastHumidity ||
            airQuality !== lastAirQuality ||
            pressure !== lastPressure ||
            uvLevel !== lastUvLevel;

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
        lastUvLevel = uvLevel;

        // Build Payload
        let p: any = {};
        
        if (config.cpu_enabled) p.cpu = cpuTemp;
        else p.cpu = null;

        if (config.battery_enabled) {
            if (battery >= 0) p.battery = battery;
        } else {
            p.battery = null;
        }

        if (config.front_distance_enabled) {
            if (front >= 0) p.front = front;
        } else {
            p.front = null;
        }

        if (config.back_distance_enabled) {
            if (back >= 0) p.back = back;
        } else {
            p.back = null;
        }

        if (config.ambient_enabled) {
            if (ambient > -999) p.ambient = ambient;
        } else {
            p.ambient = null;
        }

        if (config.humidity_enabled) {
            if (humidity >= 0) p.humidity = humidity;
        } else {
            p.humidity = null;
        }

        if (config.air_enabled) {
            if (airQuality >= 0) p.airQuality = airQuality;
        } else {
            p.airQuality = null;
        }

        if (config.pressure_enabled) {
            if (pressure >= 0) p.atmospherePressure = pressure;
        } else {
            p.atmospherePressure = null;
        }
        
        if (config.uv_enabled) {
            if (uvLevel >= 0) p.uvLevel = uvLevel;
        } else {
            p.uvLevel = null;
        }

        // Send
        Robot.DataTransfer.sendChunkedData(JSON.stringify(p), telemetryMessageId);
        telemetryMessageId = (telemetryMessageId + 1) & 0xffff;
    }
}

