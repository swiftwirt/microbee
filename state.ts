namespace Robot.State {
    let _connected = false;

    export function isConnected(): boolean {
        return _connected;
    }

    export function setConnected(status: boolean): void {
        _connected = status;
    }
}