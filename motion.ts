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

    export enum MoveState {
        Stop,
        Forward,
        Backward,
        TurnLeft,
        TurnRight,
        TurnLeftRev,
        TurnRightRev,
        SpinLeft,
        SpinRight
    }

    export let motorsRunning = false;
    export let currentDir = 0; // +1 forward, -1 backward, 0 spin/stop
    let currentMoveState = MoveState.Stop;

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
        
        // Live update if currently moving forward or turning forward
        if (motorsRunning) {
            switch (currentMoveState) {
                case MoveState.Forward: forward(); break;
                case MoveState.TurnLeft: turnLeft(); break;
                case MoveState.TurnRight: turnRight(); break;
            }
        }
    }

    export function setSpeedBackward(speed: number) {
        if (typeof speed !== "number") return;
        currentSpeedBackward = Math.max(0, Math.min(1023, speed));
        
        // Live update if currently moving backward or turning backward
        if (motorsRunning) {
            switch (currentMoveState) {
                case MoveState.Backward: backward(); break;
                case MoveState.TurnLeftRev: turnLeftBackward(); break;
                case MoveState.TurnRightRev: turnRightBackward(); break;
            }
        }
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

    // ─── MOTION FUNCTIONS ───────────────────────────────────────────────────────
    export function forward() {
        if (Robot.Sonar.frontDistance < currentFrontSafeDistance) {
            stop(); Robot.Display.showIconIfChanged(IconNames.No);
            return;
        }
        currentMoveState = MoveState.Forward;
        writeWheels(currentSpeedForward, 0, currentSpeedForward, 0);
        Robot.Display.showArrowIfChanged(ARROW_FWD);
        motorsRunning = true;
        currentDir = 1;
    }

    export function backward() {
        if (Robot.Sonar.backDistance < currentBackSafeDistance) {
            stop(); Robot.Display.showIconIfChanged(IconNames.No);
            return;
        }
        currentMoveState = MoveState.Backward;
        writeWheels(0, currentSpeedBackward, 0, currentSpeedBackward);
        Robot.Display.showArrowIfChanged(ARROW_REV);
        motorsRunning = true;
        currentDir = -1;
    }

    export function spinLeft() {
        currentMoveState = MoveState.SpinLeft;
        writeWheels(Robot.Config.MAX_MOTOR_SPEED, 0, 0, 0);
        Robot.Display.showArrowIfChanged(ARROW_SPIN_L);
        motorsRunning = true;
        currentDir = 0;
    }

    export function spinRight() {
        currentMoveState = MoveState.SpinRight;
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
        currentMoveState = MoveState.TurnLeft;
        const speed = currentSpeedForward;
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
        currentMoveState = MoveState.TurnRight;
        const speed = currentSpeedForward;
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
        currentMoveState = MoveState.TurnLeftRev;
        const speed = currentSpeedBackward;
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
        currentMoveState = MoveState.TurnRightRev;
        const speed = currentSpeedBackward;
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
        currentMoveState = MoveState.Stop;
        writeWheels(0, 0, 0, 0);
        motorsRunning = false;
        Robot.Display.showIconIfChanged(Robot.State.isConnected() ? IconNames.Happy : IconNames.Skull);
    }
}
