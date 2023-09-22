import io from "socket.io-client";

class SocketioService {
  socket;
  constructor() {}
  connect() {
    this.socket = io(`http://localhost:4000`, {
        query: {
            token: localStorage.getItem("token"),
        },
    });
  }
}

export default new SocketioService();