// ─── PIN ASSIGNMENTS ─────────────────────────────────────────────────────────
// Motor Control (Analog PWM):
//   P12: Left motor forward
//   P13: Left motor backward  
//   P14: Right motor forward
//   P15: Right motor backward
//
// Sonar Sensors (Digital I/O):
//   P16:  Front sonar trigger
//   P8:  Front sonar echo
//   P2:  Back sonar trigger
//   P1:  Back sonar echo

// ─── STATE ───────────────────────────────────────────────────────────────────
let connected = false;
let isReturning = false;