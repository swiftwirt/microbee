# microbee

A Bluetooth-controlled robot built for the micro:bit platform with obstacle avoidance, custom motor control, environmental sensing, and intuitive remote operation.

![micro:bit](https://img.shields.io/badge/micro:bit-v2.0-blue)
![MakeCode](https://img.shields.io/badge/MakeCode-Extension-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🤖 Features

- **Bluetooth Remote Control**: Control your robot wirelessly via Bluetooth UART
- **Obstacle Avoidance**: Front and rear ultrasonic sensors prevent collisions
- **Dual Motor Control**: Independent left/right wheel control with PWM precision
- **Environmental Sensing**: Real-time telemetry for Temperature, Humidity, Pressure (BME680), and UV Level
- **Custom Speed Control**: Set individual motor speeds via JSON commands
- **Visual Feedback**: LED matrix displays current status and direction
- **Safety Features**: Automatic braking and collision detection
- **Multiple Control Modes**: Simple numeric commands or advanced JSON control

## 🔧 Hardware Requirements

### Board: KittenBot Robotbit V2

Motors are controlled via the Robotbit's onboard PCA9685 I2C chip using the `pxt-robotbit` extension. No motor wiring to micro:bit pins is required.

### Pin Configuration

| Component | Pin | Function |
|-----------|-----|----------|
| **Motor Control (via Robotbit I2C)** | | |
| Left side wheels (front + back) | M1A, M1B | Robotbit motor ports |
| Right side wheels (front + back) | M2A, M2B | Robotbit motor ports |
| **Sonar Sensors** | | |
| Front Sonar Trigger | P12 | Digital Output |
| Front Sonar Echo | P8 | Digital Input |
| Back Sonar Trigger | P1 | Digital Output |
| Back Sonar Echo | P2 | Digital Input |
| **Sensors** | | |
| UV Sensor | P0 | Analog Input (requires removing Robotbit buzzer jumper) |
| BME680 SDA | P20 | I2C Data |
| BME680 SCL | P19 | I2C Clock |

> **Note:** P16 is reserved by the Robotbit's onboard RGB LEDs and cannot be used as a sonar pin.

### Required Components

- micro:bit v2
- KittenBot Robotbit V2 expansion board
- 4x DC motors (Mecanum wheel configuration)
- 18650 Li-ion battery (for Robotbit)
- 2x HC-SR04 Ultrasonic sensors (optional)
- **BME680 Sensor (Optional)**: Digital Temperature, Humidity, Pressure, and Gas sensor
- **GUVA-S12SD UV Sensor (Optional)**: Analog UV intensity sensor — remove Robotbit buzzer jumper to free P0

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
├── main.ts          # Main orchestrator
├── config.ts        # Hardware configuration and constants
├── bme680.ts        # BME680 Sensor Driver
├── telemetry.ts     # Sensor data aggregation
├── datatransfer.ts  # Comms logic (chunking/checksums)
├── ble.ts           # Bluetooth event handling
├── motion.ts        # Motor control logic
├── sonar.ts         # Ultrasonic sensor logic
├── display.ts       # UI/Display logic
├── dispatcher.ts    # Command routing
├── state.ts         # Shared system state
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


> Open this page at [https://swiftwirt.github.io/microbee/](https://swiftwirt.github.io/microbee/)

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/swiftwirt/microbee** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/swiftwirt/microbee** and click import

#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
