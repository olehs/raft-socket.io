const io = require("socket.io");
const client = require("socket.io-client");

const debug = require("debug")("raft").extend("debug");

const LifeRaft = require("liferaft");

class RaftIO extends LifeRaft {
  initialize(options = {}) {
    const { port } = new URL(this.address);
    this.socket = io(port, options.io);

    this.socket.on("connection", client => {
      client.on("message", (data, fn) => {
        debug("Received packet from %s", data.address);
        this.emit("data", data, fn);
      });
    });
  }

  write(packet, fn) {
    if (!this.socket) {
      this.socket = client(this.address);
      this.socket.on("error", error => debug(error));
    }

    debug("Writing packet to %s", this.address);
    this.socket.send(packet, data => fn(undefined, data));
  }
}

module.exports = RaftIO;
