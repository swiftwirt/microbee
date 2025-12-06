namespace Robot.Motion {
    const ARROW_FWD = ArrowNames.South;
    const ARROW_REV = ArrowNames.North;
    const ARROW_SPIN_L = ArrowNames.West;
    const ARROW_SPIN_R = ArrowNames.East;
    const ARROW_TURN_L = ArrowNames.SouthEast;
    const ARROW_TURN_R = ArrowNames.SouthWest;
    const ARROW_TURN_L_REV = ArrowNames.NorthEast;
    const ARROW_TURN_R_REV = ArrowNames.NorthWest;

    const TURN_SCALE_NUM = 4;
    const TURN_SCALE_DEN = 10;
    export const ACTIVE_BRAKE_MS = 100;

    export let motorsRunning = false;
    export let currentDir = 0; // +1 forward, -1 backward, 0 spin/stop

    // ─── MOTOR SPEED STATE ─────────────────────────────────────────────────────
    let currentSpeedForward = Robot.Config.MAX_MOTOR_SPEED;
    let currentSpeedBackward = Robot.Config.MAX_MOTOR_SPEED;

    // ─── SAFE DISTANCE STATE ───────────────────────────────────────────────────
    let currentFrontSafeDistance = Robot.Config.DEFAULT_SAFE_DISTANCE_CM;
    let currentBackSafeDistance = Robot.Config.DEFAULT_SAFE_DISTANCE_CM;

    // ─── MOTOR CONTROL CONFIG ─────────────────────────────────────────────────
    export function setSpeedForward(speed: number) {
        if (typeof speed !== "number") return;
        currentSpeedForward = Math.max(0, Math.min(1023, speed));
    }

    export function setSpeedBackward(speed: number) {
        if (typeof speed !== "number") return;
        currentSpeedBackward = Math.max(0, Math.min(1023, speed));
    }

    export function setSpeeds(speedForward: number, speedBackward: number) {
        setSpeedForward(speedForward);
        setSpeedBackward(speedBackward);
    }

    export function setSafeDistanceFront(distance: number) {
        if (typeof distance !== "number") return;
        // Range: 20cm to 100cm
        currentFrontSafeDistance = Math.max(20, Math.min(100, distance));
    }

    export function setSafeDistanceBack(distance: number) {
        if (typeof distance !== "number") return;
        // Range: 5cm to 200cm
        currentBackSafeDistance = Math.max(5, Math.min(200, distance));
    }

    export function setSafeDistances(frontDistance: number, backDistance: number) {
        setSafeDistanceFront(frontDistance);
        setSafeDistanceBack(backDistance);
    }

    export function getCurrentFrontSafeDistance(): number { return currentFrontSafeDistance; }
    export function getCurrentBackSafeDistance(): number { return currentBackSafeDistance; }

    function getEffectiveSpeed(speed: number): number {
        return speed > 0 ? speed : Robot.Config.MAX_MOTOR_SPEED;
    }

    // ─── MOTION FUNCTIONS ───────────────────────────────────────────────────────
    export function forward() {
        if (Robot.Sonar.frontDistance < currentFrontSafeDistance) {
            stop(); Robot.Display.showIconIfChanged(IconNames.No);
            return;
        }
        writeWheels(getEffectiveSpeed(currentSpeedForward), 0, getEffectiveSpeed(currentSpeedForward), 0);
        Robot.Display.showArrowIfChanged(ARROW_FWD);
        motorsRunning = true;
        currentDir = 1;
    }

    export function backward() {
        if (Robot.Sonar.backDistance < currentBackSafeDistance) {
            stop(); Robot.Display.showIconIfChanged(IconNames.No);
            return;
        }
        writeWheels(0, getEffectiveSpeed(currentSpeedBackward), 0, getEffectiveSpeed(currentSpeedBackward));
        Robot.Display.showArrowIfChanged(ARROW_REV);
        motorsRunning = true;
        currentDir = -1;
    }

    export function spinLeft() {
        writeWheels(Robot.Config.MAX_MOTOR_SPEED, 0, 0, 0);
        Robot.Display.showArrowIfChanged(ARROW_SPIN_L);
        motorsRunning = true;
        currentDir = 0;
    }

    export function spinRight() {
        writeWheels(0, 0, Robot.Config.MAX_MOTOR_SPEED, 0);
        Robot.Display.showArrowIfChanged(ARROW_SPIN_R);
        motorsRunning = true;
        currentDir = 0;
    }

    export function turnLeft() {
        if (Robot.Sonar.frontDistance < currentFrontSafeDistance) {
            stop(); Robot.Display.showIconIfChanged(IconNames.No);
            return;
        }
        const speed = getEffectiveSpeed(currentSpeedForward);
        const slow = Math.idiv(speed * TURN_SCALE_NUM, TURN_SCALE_DEN);
        writeWheels(speed, 0, slow, 0);
        Robot.Display.showArrowIfChanged(ARROW_TURN_L);
        motorsRunning = true;
        currentDir = 1;
    }

    export function turnRight() {
        if (Robot.Sonar.frontDistance < currentFrontSafeDistance) {
            stop(); Robot.Display.showIconIfChanged(IconNames.No);
            return;
        }
        const speed = getEffectiveSpeed(currentSpeedForward);
        const slow = Math.idiv(speed * TURN_SCALE_NUM, TURN_SCALE_DEN);
        writeWheels(slow, 0, speed, 0);
        Robot.Display.showArrowIfChanged(ARROW_TURN_R);
        motorsRunning = true;
        currentDir = 1;
    }

    export function turnLeftBackward() {
        if (Robot.Sonar.backDistance < currentBackSafeDistance) {
            stop(); Robot.Display.showIconIfChanged(IconNames.No);
            return;
        }
        const speed = getEffectiveSpeed(currentSpeedBackward);
        const slow = Math.idiv(speed * TURN_SCALE_NUM, TURN_SCALE_DEN);
        writeWheels(0, speed, 0, slow);
        Robot.Display.showArrowIfChanged(ARROW_TURN_L_REV);
        motorsRunning = true;
        currentDir = -1;
    }

    export function turnRightBackward() {
        if (Robot.Sonar.backDistance < currentBackSafeDistance) {
            stop(); Robot.Display.showIconIfChanged(IconNames.No);
            return;
        }
        const speed = getEffectiveSpeed(currentSpeedBackward);
        const slow = Math.idiv(speed * TURN_SCALE_NUM, TURN_SCALE_DEN);
        writeWheels(0, slow, 0, speed);
        Robot.Display.showArrowIfChanged(ARROW_TURN_R_REV);
        motorsRunning = true;
        currentDir = -1;
    }

    // ─── LOW-LEVEL MOTOR CONTROL ────────────────────────────────────────────────
    export function writeWheels(Lf: number, Lb: number, Rf: number, Rb: number) {
        pins.analogWritePin(Robot.Config.PIN_MOTOR_LEFT_FWD, Lf);
        pins.analogWritePin(Robot.Config.PIN_MOTOR_LEFT_REV, Lb);
        pins.analogWritePin(Robot.Config.PIN_MOTOR_RIGHT_FWD, Rf);
        pins.analogWritePin(Robot.Config.PIN_MOTOR_RIGHT_REV, Rb);
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
