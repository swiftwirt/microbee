namespace Robot.Motion {
    const ARROW_FWD = ArrowNames.South;
    const ARROW_REV = ArrowNames.North;
    const ARROW_SPIN_L = ArrowNames.West;
    const ARROW_SPIN_R = ArrowNames.East;
    const ARROW_TURN_L = ArrowNames.SouthEast;
    const ARROW_TURN_R = ArrowNames.SouthWest;
    const ARROW_TURN_L_REV = ArrowNames.NorthEast;
    const ARROW_TURN_R_REV = ArrowNames.NorthWest;
    const FRONT_SERVO_CHANNEL = robotbit.Servos.S1;
    const FRONT_SERVO_LEFT_DEG = 160;
    const FRONT_SERVO_CENTER_DEG = 90;
    const FRONT_SERVO_RIGHT_DEG = 20;

    const TURN_SCALE_NUM = 4;
    const TURN_SCALE_DEN = 10;
    export const ACTIVE_BRAKE_MS = 100;

    export let motorsRunning = false;
    export let currentDir = 0; // +1 forward, -1 backward, 0 spin/stop

    // ─── MOTOR SPEED STATE ─────────────────────────────────────────────────────
    let currentLeftSpeed = 0;
    let currentRightSpeed = 0;

    // ─── SAFE DISTANCE STATE ───────────────────────────────────────────────────
    let currentFrontSafeDistance = Robot.Config.DEFAULT_SAFE_DISTANCE_CM;
    let currentBackSafeDistance = Robot.Config.DEFAULT_SAFE_DISTANCE_CM;

    // ─── INDIVIDUAL MOTOR CONTROL ─────────────────────────────────────────────
    export function setMotorSpeeds(leftSpeed: number, rightSpeed: number) {
        leftSpeed = (typeof leftSpeed === "number") ? leftSpeed : Robot.Config.MAX_MOTOR_SPEED;
        rightSpeed = (typeof rightSpeed === "number") ? rightSpeed : Robot.Config.MAX_MOTOR_SPEED;

        currentLeftSpeed = Math.max(0, Math.min(Robot.Config.MAX_MOTOR_SPEED, leftSpeed));
        currentRightSpeed = Math.max(0, Math.min(Robot.Config.MAX_MOTOR_SPEED, rightSpeed));
    }

    export function setSafeDistances(frontDistance: number, backDistance: number) {
        frontDistance = (typeof frontDistance === "number") ? frontDistance : Robot.Config.DEFAULT_SAFE_DISTANCE_CM;
        backDistance = (typeof backDistance === "number") ? backDistance : Robot.Config.DEFAULT_SAFE_DISTANCE_CM;

        currentFrontSafeDistance = Math.max(20, Math.min(100, frontDistance));
        currentBackSafeDistance = Math.max(5, Math.min(200, backDistance));
    }

    export function getCurrentFrontSafeDistance(): number { return currentFrontSafeDistance; }
    export function getCurrentBackSafeDistance(): number { return currentBackSafeDistance; }
    export function centerFrontServo() {
        robotbit.Servo(FRONT_SERVO_CHANNEL, FRONT_SERVO_CENTER_DEG);
    }

    function getEffectiveSpeed(speed: number): number {
        return speed > 0 ? speed : Robot.Config.MAX_MOTOR_SPEED;
    }

    // ─── MOTION FUNCTIONS ───────────────────────────────────────────────────────
    export function forward() {
        if (Robot.Sonar.frontDistance < currentFrontSafeDistance) {
            stop(); Robot.Display.showIconIfChanged(IconNames.No);
            return;
        }
        writeWheels(getEffectiveSpeed(currentLeftSpeed), 0, getEffectiveSpeed(currentRightSpeed), 0);
        Robot.Display.showArrowIfChanged(ARROW_FWD);
        motorsRunning = true;
        currentDir = 1;
    }

    export function backward() {
        if (Robot.Sonar.backDistance >= 0 && Robot.Sonar.backDistance < currentBackSafeDistance) {
            stop(); Robot.Display.showIconIfChanged(IconNames.No);
            return;
        }
        writeWheels(0, getEffectiveSpeed(currentLeftSpeed), 0, getEffectiveSpeed(currentRightSpeed));
        Robot.Display.showArrowIfChanged(ARROW_REV);
        motorsRunning = true;
        currentDir = -1;
    }

    export function spinLeft() {
        stop();
        robotbit.Servo(FRONT_SERVO_CHANNEL, FRONT_SERVO_LEFT_DEG);
        Robot.Display.showArrowIfChanged(ARROW_SPIN_L);
        currentDir = 0;
    }

    export function spinRight() {
        stop();
        robotbit.Servo(FRONT_SERVO_CHANNEL, FRONT_SERVO_RIGHT_DEG);
        Robot.Display.showArrowIfChanged(ARROW_SPIN_R);
        currentDir = 0;
    }

    export function turnLeft() {
        if (Robot.Sonar.frontDistance < currentFrontSafeDistance) {
            stop(); Robot.Display.showIconIfChanged(IconNames.No);
            return;
        }
        const left = getEffectiveSpeed(currentLeftSpeed);
        const right = getEffectiveSpeed(currentRightSpeed);
        const slow = Math.idiv(right * TURN_SCALE_NUM, TURN_SCALE_DEN);
        writeWheels(left, 0, slow, 0);
        Robot.Display.showArrowIfChanged(ARROW_TURN_L);
        motorsRunning = true;
        currentDir = 1;
    }

    export function turnRight() {
        if (Robot.Sonar.frontDistance < currentFrontSafeDistance) {
            stop(); Robot.Display.showIconIfChanged(IconNames.No);
            return;
        }
        const left = getEffectiveSpeed(currentLeftSpeed);
        const right = getEffectiveSpeed(currentRightSpeed);
        const slow = Math.idiv(left * TURN_SCALE_NUM, TURN_SCALE_DEN);
        writeWheels(slow, 0, right, 0);
        Robot.Display.showArrowIfChanged(ARROW_TURN_R);
        motorsRunning = true;
        currentDir = 1;
    }

    export function turnLeftBackward() {
        if (Robot.Sonar.backDistance >= 0 && Robot.Sonar.backDistance < currentBackSafeDistance) {
            stop(); Robot.Display.showIconIfChanged(IconNames.No);
            return;
        }
        const left = getEffectiveSpeed(currentLeftSpeed);
        const right = getEffectiveSpeed(currentRightSpeed);
        const slow = Math.idiv(right * TURN_SCALE_NUM, TURN_SCALE_DEN);
        writeWheels(0, left, 0, slow);
        Robot.Display.showArrowIfChanged(ARROW_TURN_L_REV);
        motorsRunning = true;
        currentDir = -1;
    }

    export function turnRightBackward() {
        if (Robot.Sonar.backDistance >= 0 && Robot.Sonar.backDistance < currentBackSafeDistance) {
            stop(); Robot.Display.showIconIfChanged(IconNames.No);
            return;
        }
        const left = getEffectiveSpeed(currentLeftSpeed);
        const right = getEffectiveSpeed(currentRightSpeed);
        const slow = Math.idiv(left * TURN_SCALE_NUM, TURN_SCALE_DEN);
        writeWheels(0, slow, 0, right);
        Robot.Display.showArrowIfChanged(ARROW_TURN_R_REV);
        motorsRunning = true;
        currentDir = -1;
    }

    // ─── LOW-LEVEL MOTOR CONTROL ────────────────────────────────────────────────
    // Robotbit V2: M1A+M1B = left side, M2A+M2B = right side (4 Mecanum wheels).
    // Signed speed: positive = forward, negative = backward.
    export function writeWheels(Lf: number, Lb: number, Rf: number, Rb: number) {
        const leftSpeed = Lf > 0 ? Lf : -Lb;
        const rightSpeed = Rf > 0 ? Rf : -Rb;
        robotbit.MotorRun(robotbit.Motors.M1A, leftSpeed);
        robotbit.MotorRun(robotbit.Motors.M1B, leftSpeed);
        robotbit.MotorRun(robotbit.Motors.M2A, rightSpeed);
        robotbit.MotorRun(robotbit.Motors.M2B, rightSpeed);
    }

    export function brakePulse() {
        if (!ACTIVE_BRAKE_MS) return;
        const pulse = Math.idiv(Robot.Config.MAX_MOTOR_SPEED, 2);
        writeWheels(
            currentDir > 0 ? 0 : pulse,
            currentDir > 0 ? pulse : 0,
            currentDir > 0 ? 0 : pulse,
            currentDir > 0 ? pulse : 0
        );
        basic.pause(ACTIVE_BRAKE_MS);
    }

    export function stop() {
        if (motorsRunning) brakePulse();
        writeWheels(0, 0, 0, 0);
        motorsRunning = false;
        Robot.Display.showIconIfChanged(Robot.State.isConnected() ? IconNames.Happy : IconNames.Skull);
    }
}