const SOCKET_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/signaling';

class SocketService {
    constructor() {
        this.socket = null;
        this.onMessageCallback = null;
    }

    connect(roomId) {
        if (this.socket) return;

        this.socket = new WebSocket(`${SOCKET_URL}/${roomId}`);

        this.socket.onopen = () => {
            console.log('WebSocket Connected');
        };

        this.socket.onmessage = (event) => {
            if (this.onMessageCallback) {
                const data = JSON.parse(event.data);
                this.onMessageCallback(data);
            }
        };

        this.socket.onclose = () => {
            console.log('WebSocket Disconnected');
            this.socket = null;
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    sendMessage(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
    }

    onMessage(callback) {
        this.onMessageCallback = callback;
    }
}

const socketService = new SocketService();
export default socketService;
