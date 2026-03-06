import { io, Socket } from 'socket.io-client';

const API_URL = 'http://127.0.0.1:8000';

class SocketService {
  public socket: Socket | null = null;

  connect(wishlistSlug: string, onUpdate: (data: any) => void) {
    if (this.socket) this.socket.disconnect();
    
    this.socket = io(API_URL, { transports: ['websocket'] });
    
    this.socket.on('connect', () => {
      console.log('Socket connected to', wishlistSlug);
      this.socket?.emit('join_wishlist', wishlistSlug);
    });

    this.socket.on('wishlist_updated', onUpdate);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();
