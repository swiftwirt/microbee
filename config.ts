namespace Robot.Config {
    // ─── PIN DEFINITIONS ─────────────────────────────────────────────────────────
    export const PIN_MOTOR_LEFT_FWD = AnalogPin.P12;
    export const PIN_MOTOR_LEFT_REV = AnalogPin.P13;
    export const PIN_MOTOR_RIGHT_FWD = AnalogPin.P14;
    export const PIN_MOTOR_RIGHT_REV = AnalogPin.P15;

    export const PIN_SONAR_FRONT_TRIG = DigitalPin.P16;
    export const PIN_SONAR_FRONT_ECHO = DigitalPin.P8;
    export const PIN_SONAR_BACK_TRIG = DigitalPin.P1;
    export const PIN_SONAR_BACK_ECHO = DigitalPin.P2;

    export const PIN_UV_SENSOR = AnalogPin.P0;

    // ─── I2C CONFIG ──────────────────────────────────────────────────────────────
    export const BME680_I2C_ADDRESS = 0x77;

    // ─── SYSTEM CONSTANTS ────────────────────────────────────────────────────────
    export const MAX_MOTOR_SPEED = 1023;
    export const DEFAULT_SAFE_DISTANCE_CM = 40;
    export const SONAR_RETRY_COUNT = 2;
    export const SONAR_INTERVAL_MS = 80;
    export const TELEMETRY_INTERVAL_MS = 1000;
}