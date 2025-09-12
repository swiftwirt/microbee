// ─── PIN ASSIGNMENTS ─────────────────────────────────────────────────────────
// Motor Control (Analog PWM):
//   P12: Left motor forward
//   P13: Left motor backward  
//   P14: Right motor forward
//   P15: Right motor backward
//
// Sonar Sensors (Digital I/O):
//   P6:  Front sonar trigger
//   P2:  Front sonar echo
//   P9:  Back sonar trigger
//   P3:  Back sonar echo

// ─── STATE ───────────────────────────────────────────────────────────────────
let connected = false;
let isReturning = false;