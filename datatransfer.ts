namespace Robot.DataTransfer {
    // ─── CHUNKED DATA TRANSFER WITH CHECKSUM ───────────────────────────────────
    const MAX_CHUNK_SIZE = 1000; // Max bytes per chunk (well under 16KB limit)
    // const CHUNK_HEADER_SIZE = 20; // Approximate header overhead (unused but good for reference)

    // Simple checksum: sum of all bytes modulo 65536
    export function calculateChecksum(data: string): number {
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum = (sum + data.charCodeAt(i)) % 65536;
        }
        return sum;
    }

    // Split large data into chunks with checksums
    // Format: {"type":"chunk","id":X,"seq":Y,"total":Z,"data":"...","csum":N}
    export function sendChunkedData(data: string, messageId: number = 0): void {
        if (data.length <= MAX_CHUNK_SIZE) {
            // Small enough to send directly with checksum
            let checksum = calculateChecksum(data);
            let packet = {
                type: "data",
                id: messageId,
                data: data,
                csum: checksum
            };
            bluetooth.uartWriteString(JSON.stringify(packet) + "\n");
            return;
        }

        // Split into chunks
        let totalChunks = Math.idiv(data.length + MAX_CHUNK_SIZE - 1, MAX_CHUNK_SIZE);
        let chunkId = 0;

        for (let i = 0; i < data.length; i += MAX_CHUNK_SIZE) {
            let chunkData = data.substr(i, MAX_CHUNK_SIZE);
            let checksum = calculateChecksum(chunkData);

            let packet = {
                type: "chunk",
                id: messageId,
                seq: chunkId,
                total: totalChunks,
                data: chunkData,
                csum: checksum
            };

            bluetooth.uartWriteString(JSON.stringify(packet) + "\n");
            chunkId++;

            // Small delay between chunks to avoid overwhelming the buffer
            basic.pause(10);
        }
    }

    // Verify checksum of received data
    export function verifyChecksum(data: string, expectedChecksum: number): boolean {
        return calculateChecksum(data) === expectedChecksum;
    }
}