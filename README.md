# microbee

A Bluetooth-controlled robot built for the micro:bit platform with obstacle avoidance, custom motor control, and intuitive remote operation.

![micro:bit](https://img.shields.io/badge/micro:bit-v2.0-blue)
![MakeCode](https://img.shields.io/badge/MakeCode-Extension-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🤖 Features

- **Bluetooth Remote Control**: Control your robot wirelessly via Bluetooth UART
- **Obstacle Avoidance**: Front and rear ultrasonic sensors prevent collisions
- **Dual Motor Control**: Independent left/right wheel control with PWM precision
- **Custom Speed Control**: Set individual motor speeds via JSON commands
- **Visual Feedback**: LED matrix displays current status and direction
- **Safety Features**: Automatic braking and collision detection
- **Multiple Control Modes**: Simple numeric commands or advanced JSON control

## 🔧 Hardware Requirements

### micro:bit Pin Configuration

| Component | Pin | Function |
|-----------|-----|----------|
| **Motor Control** | | |
| Left Motor Forward | P12 | PWM Output |
| Left Motor Backward | P13 | PWM Output |
| Right Motor Forward | P14 | PWM Output |
| Right Motor Backward | P15 | PWM Output |
| **Sonar Sensors** | | |
| Front Sonar Trigger | P6 | Digital Output |
| Front Sonar Echo | P2 | Digital Input |
| Back Sonar Trigger | P9 | Digital Output |
| Back Sonar Echo | P3 | Digital Input |

### Required Components

- micro:bit v2 (recommended) or v1.5
- 2x DC Motors with wheels
- Motor driver module (L298N or similar)
- 2x HC-SR04 Ultrasonic sensors
- Robot chassis and battery pack

## 🚀 Quick Start

### Installation

1. **Open MakeCode**
   - Go to [makecode.microbit.org](https://makecode.microbit.org/)

2. **Import Project**
   - Click **Import** then click **Import URL**
   - Paste: `https://github.com/swiftwirt/microbee`
   - Click **Go** to import the project

### Basic Usage

1. **Power on** your robot
2. **Pair via Bluetooth** on your device
3. **Send commands** using the control interface

## 📡 Control Commands

### Simple Numeric Commands

| Command | Action | Description |
|---------|--------|-------------|
| `1` | Forward | Move forward (with obstacle detection) |
| `2` | Backward | Move backward (with obstacle detection) |
| `3` | Spin Left | Rotate left in place |
| `4` | Spin Right | Rotate right in place |
| `5` | Turn Left | Turn left while moving forward |
| `6` | Turn Right | Turn right while moving forward |
| `7` | Turn Left Backward | Turn left while moving backward |
| `8` | Turn Right Backward | Turn right while moving backward |
| `0` or any other | Stop | Stop all motors |

### Advanced JSON Control

For precise motor control, send JSON commands:

```json
{"l": 512, "r": 768}
```

- `l`: Left motor speed (0-1023)
- `r`: Right motor speed (0-1023)
- `0` = stopped, `1023` = maximum speed

## 🛡️ Safety Features

- **Obstacle Detection**: Automatically stops when obstacles are detected within 40cm
- **Active Braking**: Brief reverse pulse when stopping for better control
- **Connection Monitoring**: Visual indicators show Bluetooth connection status
- **Speed Validation**: Motor speeds are clamped to safe ranges (0-1023)

## 📊 Status Indicators

The micro:bit LED matrix displays:

| Icon | Meaning |
|------|---------|
| ❤️ | Bluetooth connected |
| 💀 | Bluetooth disconnected |
| ⬇️ | Moving forward |
| ⬆️ | Moving backward |
| ⬅️ | Spinning left |
| ➡️ | Spinning right |
| ❌ | Obstacle detected |
| 😊 | Stopped and ready |

## 🔧 Development

### Project Structure

```
microbee/
├── main.ts          # Main program entry point
├── ble.ts           # Bluetooth communication
├── motion.ts        # Motor control and movement
├── sonar.ts         # Ultrasonic sensor handling
├── display.ts       # LED matrix display utilities
├── dispatcher.ts    # Command parsing and routing
└── test.ts          # Test functions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the micro:bit platform
- Uses Microsoft MakeCode for development
- Inspired by robotics education and maker communities

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/swiftwirt/microbee/issues) page
2. Create a new issue with detailed information
3. Include your hardware setup and error messages

---

**Happy Making!** 🚀🤖
