namespace Robot.State {
    export interface SensorConfig {
        cpu_enabled: boolean;
        battery_enabled: boolean;
        air_enabled: boolean;
        ambient_enabled: boolean;
        humidity_enabled: boolean;
        pressure_enabled: boolean;
        uv_enabled: boolean;
        front_distance_enabled: boolean;
        back_distance_enabled: boolean;
    }

    export let sensorConfig: SensorConfig = {
        cpu_enabled: true,
        battery_enabled: true,
        air_enabled: true,
        ambient_enabled: true,
        humidity_enabled: true,
        pressure_enabled: true,
        uv_enabled: true,
        front_distance_enabled: true,
        back_distance_enabled: true
    };

    let _connected = false;

    export function isConnected(): boolean {
        return _connected;
    }

    export function setConnected(status: boolean): void {
        _connected = status;
    }
}