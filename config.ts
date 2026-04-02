namespace Robot.Config {
    // ─── PIN DEFINITIONS ─────────────────────────────────────────────────────────
    // Motors are driven via the Robotbit V2 PCA9685 I2C chip (robotbit extension).
    // P12–P15 are now free; P16 is reserved by Robotbit onboard RGB LEDs.
    // Single front sonar follows the reference setup: TRIG=P2, ECHO=P8.

    export const PIN_SONAR_FRONT_TRIG = DigitalPin.P2;
    export const PIN_SONAR_FRONT_ECHO = DigitalPin.P8;
    export const PIN_SONAR_BACK_TRIG = DigitalPin.P1; // unused on single-sonar robot
    export const PIN_SONAR_BACK_ECHO = DigitalPin.P12; // unused on single-sonar robot

    // ─── I2C CONFIG ──────────────────────────────────────────────────────────────
    export const BME680_I2C_ADDRESS = 0x77;

    // ─── SYSTEM CONSTANTS ────────────────────────────────────────────────────────
    export const MAX_MOTOR_SPEED = 255;
    export const DEFAULT_SAFE_DISTANCE_CM = 40;
    export const SONAR_RETRY_COUNT = 2;
    export const SONAR_INTERVAL_MS = 80;
    export const TELEMETRY_INTERVAL_MS = 1000;
}