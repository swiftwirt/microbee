// ─── PIN ASSIGNMENTS ─────────────────────────────────────────────────────────
// Motor Control (Analog PWM):
//   P12: Left motor forward
//   P13: Left motor backward  
//   P14: Right motor forward
//   P15: Right motor backward
//
// Sonar Sensors (Digital I/O):
//   P6:  Front sonar trigger
//   P7:  Front sonar echo
//   P9:  Back sonar trigger
//   P10: Back sonar echo
//
// Environmental Sensor (Digital I/O):
//   P3:  DHT11 temperature/humidity sensor
//
// Built-in Features:
//   Buttons A, B, AB (built-in)
//   LED matrix (built-in)
//   Bluetooth (built-in)

// ─── STATE ───────────────────────────────────────────────────────────────────
let connected = false;
let isReturning = false;