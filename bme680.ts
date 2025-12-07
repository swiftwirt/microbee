namespace Robot.Drivers.BME680 {
    // ──────────────── BME680 CONSTANTS ────────────────
    const BME680_REG_CHIP_ID = 0xD0;
    const BME680_CHIP_ID = 0x61;

    const BME680_REG_CTRL_HUM = 0x72;
    const BME680_REG_CTRL_MEAS = 0x74;
    const BME680_REG_CONFIG = 0x75;

    const BME680_REG_PRESS_MSB = 0x1F;
    const BME680_REG_GAS_MSB = 0x2A;

    let bme680Detected = false;
    let bme680Initialized = false;

    // ───── REUSABLE I2C BUFFERS (reduce memory allocation) ─────
    const i2cWrite1 = pins.createBuffer(1);
    const i2cWrite2 = pins.createBuffer(2);

    // ───── BME680 CALIBRATION COEFFICIENTS (par_*) ─────
    let par_t1 = 0; let par_t2 = 0; let par_t3 = 0;
    let par_p1 = 0; let par_p2 = 0; let par_p3 = 0;
    let par_p4 = 0; let par_p5 = 0; let par_p6 = 0;
    let par_p7 = 0; let par_p8 = 0; let par_p9 = 0; let par_p10 = 0;
    let par_h1 = 0; let par_h2 = 0; let par_h3 = 0;
    let par_h4 = 0; let par_h5 = 0; let par_h6 = 0; let par_h7 = 0;

    let tFine = 0; // Global fine temperature

    function toSigned16(x: number): number { return x > 32767 ? x - 65536 : x; }
    function toSigned8(x: number): number { return x > 127 ? x - 256 : x; }

    function readBME680Calibration(): void {
        let b: Buffer;
        const addr = Robot.Config.BME680_I2C_ADDRESS;

        // ---- temperature calibration ----
        i2cWrite1[0] = 0x8A; pins.i2cWriteBuffer(addr, i2cWrite1, false);
        b = pins.i2cReadBuffer(addr, 2, false);
        par_t2 = toSigned16(b[0] | (b[1] << 8));

        i2cWrite1[0] = 0x8C; pins.i2cWriteBuffer(addr, i2cWrite1, false);
        par_t3 = toSigned8(pins.i2cReadNumber(addr, NumberFormat.UInt8LE, false));

        i2cWrite1[0] = 0xE9; pins.i2cWriteBuffer(addr, i2cWrite1, false);
        b = pins.i2cReadBuffer(addr, 2, false);
        par_t1 = b[0] | (b[1] << 8);

        // ---- pressure calibration ----
        i2cWrite1[0] = 0x8E; pins.i2cWriteBuffer(addr, i2cWrite1, false);
        b = pins.i2cReadBuffer(addr, 2, false);
        par_p1 = b[0] | (b[1] << 8);

        i2cWrite1[0] = 0x90; pins.i2cWriteBuffer(addr, i2cWrite1, false);
        b = pins.i2cReadBuffer(addr, 2, false);
        par_p2 = toSigned16(b[0] | (b[1] << 8));

        i2cWrite1[0] = 0x92; pins.i2cWriteBuffer(addr, i2cWrite1, false);
        par_p3 = toSigned8(pins.i2cReadNumber(addr, NumberFormat.UInt8LE, false));

        i2cWrite1[0] = 0x94; pins.i2cWriteBuffer(addr, i2cWrite1, false);
        b = pins.i2cReadBuffer(addr, 2, false);
        par_p4 = toSigned16(b[0] | (b[1] << 8));

        i2cWrite1[0] = 0x96; pins.i2cWriteBuffer(addr, i2cWrite1, false);
        b = pins.i2cReadBuffer(addr, 2, false);
        par_p5 = toSigned16(b[0] | (b[1] << 8));

        i2cWrite1[0] = 0x99; pins.i2cWriteBuffer(addr, i2cWrite1, false);
        par_p6 = toSigned8(pins.i2cReadNumber(addr, NumberFormat.UInt8LE, false));

        i2cWrite1[0] = 0x98; pins.i2cWriteBuffer(addr, i2cWrite1, false);
        par_p7 = toSigned8(pins.i2cReadNumber(addr, NumberFormat.UInt8LE, false));

        i2cWrite1[0] = 0x9C; pins.i2cWriteBuffer(addr, i2cWrite1, false);
        b = pins.i2cReadBuffer(addr, 2, false);
        par_p8 = toSigned16(b[0] | (b[1] << 8));

        i2cWrite1[0] = 0x9E; pins.i2cWriteBuffer(addr, i2cWrite1, false);
        b = pins.i2cReadBuffer(addr, 2, false);
        par_p9 = toSigned16(b[0] | (b[1] << 8));

        i2cWrite1[0] = 0xA0; pins.i2cWriteBuffer(addr, i2cWrite1, false);
        par_p10 = toSigned8(pins.i2cReadNumber(addr, NumberFormat.UInt8LE, false));

        // ---- humidity calibration ----
        i2cWrite1[0] = 0xE1; pins.i2cWriteBuffer(addr, i2cWrite1, false);
        b = pins.i2cReadBuffer(addr, 7, false);
        let e1 = b[0]; let e2 = b[1]; let e3 = b[2];
        let e4 = b[3]; let e5 = b[4]; let e6 = b[5]; let e7 = b[6];

        par_h1 = (e3 << 4) | (e2 & 0x0F);
        par_h2 = toSigned16((e1 << 4) | (e2 >> 4));
        par_h3 = toSigned8(e4);
        par_h4 = toSigned8(e5);
        par_h5 = toSigned8(e6);
        par_h6 = toSigned8(e7);

        i2cWrite1[0] = 0xE8; pins.i2cWriteBuffer(addr, i2cWrite1, false);
        par_h7 = toSigned8(pins.i2cReadNumber(addr, NumberFormat.UInt8LE, false));
    }

    export function init(): boolean {
        if (bme680Initialized) return bme680Detected;
        const addr = Robot.Config.BME680_I2C_ADDRESS;

        try {
            i2cWrite1[0] = BME680_REG_CHIP_ID;
            pins.i2cWriteBuffer(addr, i2cWrite1, false);
            let chipId = pins.i2cReadNumber(addr, NumberFormat.UInt8LE, false);

            if (chipId != BME680_CHIP_ID) {
                bme680Detected = false;
                bme680Initialized = true;
                return false;
            }

            readBME680Calibration();

            // Config: Humidity x1, Temp/Press x1, Forced Mode, IIR Off
            i2cWrite2[0] = BME680_REG_CTRL_HUM; i2cWrite2[1] = 0x01;
            pins.i2cWriteBuffer(addr, i2cWrite2, false);

            i2cWrite2[0] = BME680_REG_CTRL_MEAS; i2cWrite2[1] = 0x25;
            pins.i2cWriteBuffer(addr, i2cWrite2, false);

            i2cWrite2[0] = BME680_REG_CONFIG; i2cWrite2[1] = 0x00;
            pins.i2cWriteBuffer(addr, i2cWrite2, false);

            bme680Detected = true;
        } catch (e) {
            bme680Detected = false;
        }
        bme680Initialized = true;
        return bme680Detected;
    }

    function readRawAll(): { t: number, p: number, h: number } {
        const addr = Robot.Config.BME680_I2C_ADDRESS;

        // Trigger forced measurement
        i2cWrite2[0] = BME680_REG_CTRL_MEAS; i2cWrite2[1] = 0x25;
        pins.i2cWriteBuffer(addr, i2cWrite2, false);
        basic.pause(30); // Wait for conversion

        i2cWrite1[0] = BME680_REG_PRESS_MSB;
        pins.i2cWriteBuffer(addr, i2cWrite1, false);
        let buf = pins.i2cReadBuffer(addr, 8, false);

        let adcPress = (buf[0] << 12) | (buf[1] << 4) | (buf[2] >> 4);
        let adcTemp = (buf[3] << 12) | (buf[4] << 4) | (buf[5] >> 4);
        let adcHum = (buf[6] << 8) | buf[7];

        return { t: adcTemp, p: adcPress, h: adcHum };
    }

    function compensateTemperature(adcTemp: number): number {
        let var1 = (adcTemp / 16384.0 - par_t1 / 1024.0) * par_t2;
        let var2 = (((adcTemp / 131072.0) - (par_t1 / 8192.0)) *
            ((adcTemp / 131072.0) - (par_t1 / 8192.0))) * (par_t3 * 16.0);
        tFine = var1 + var2;
        return tFine / 5120.0;
    }

    function compensatePressure(adcPress: number): number {
        let var1 = tFine / 2.0 - 64000.0;
        let var2 = var1 * var1 * par_p6 / 131072.0;
        var2 = var2 + var1 * par_p5 * 2.0;
        var2 = var2 / 4.0 + par_p4 * 65536.0;

        var1 = (par_p3 * var1 * var1 / 16384.0 + par_p2 * var1) / 524288.0;
        var1 = (1.0 + var1 / 32768.0) * par_p1;

        if (var1 == 0) return -1;

        let press = 1048576.0 - adcPress;
        press = (press - var2 / 4096.0) * 6250.0 / var1;

        let var3 = (press / 256.0) * (press / 256.0) * (press / 256.0) * (par_p10 / 131072.0);
        var1 = par_p9 * press * press / 2147483648.0;
        var2 = press * par_p8 / 32768.0;

        return press + (var1 + var2 + var3 + par_p7 * 128.0) / 16.0;
    }

    function compensateHumidity(adcHum: number, tempComp: number): number {
        let var1 = adcHum - (par_h1 * 16.0 + (par_h3 / 2.0) * tempComp);
        let var2 = var1 * (par_h2 / 262144.0 * (1.0 + (par_h4 / 16384.0) * tempComp +
            (par_h5 / 1048576.0) * tempComp * tempComp));
        let var3 = par_h6 / 16384.0;
        let var4 = par_h7 / 2097152.0;
        let hum = var2 + (var3 + var4 * tempComp) * var2 * var2;
        return Math.max(0, Math.min(100, hum));
    }

    export function readSample(): { ambient: number, humidity: number, pressure: number, gas: number } {
        if (!bme680Detected) return { ambient: -999, humidity: -1, pressure: -1, gas: -1 };

        try {
            let raw = readRawAll();
            let tempC = compensateTemperature(raw.t);
            let pPa = compensatePressure(raw.p);
            let pHpa = pPa / 100.0;
            let h = compensateHumidity(raw.h, tempC);

            // Gas reading (optional/unreliable on some modules without heating setup)
            let gas = -1;
            try {
                i2cWrite1[0] = BME680_REG_GAS_MSB;
                pins.i2cWriteBuffer(Robot.Config.BME680_I2C_ADDRESS, i2cWrite1, false);
                let gb = pins.i2cReadBuffer(Robot.Config.BME680_I2C_ADDRESS, 2, false);
                gas = (gb[0] << 8) | gb[1];
            } catch (e) { gas = -1; }

            return {
                ambient: Math.round(tempC * 1),
                humidity: Math.round(h * 1),
                pressure: Math.round(pHpa * 1),
                gas: gas
            };
        } catch (e) {
            return { ambient: -999, humidity: -1, pressure: -1, gas: -1 };
        }
    }
}