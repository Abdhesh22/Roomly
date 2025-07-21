const mongoose = require("mongoose");

class DBConnection {
  constructor() {
    this.connected = false;
  }

  async connect(uri) {
    if (this.connected) {
      console.log("[DB] Already connected");
      return;
    }

    try {
      mongoose.connect(process.env.MONGO_DB_CONNECTION_URL);
      this.connected = true;
      console.log("[DB] Connection established");
    } catch (error) {
      console.error("[DB] Connection failed:", error.message);
      throw error;
    }
  }

  disconnect() {
    if (this.connected) {
      mongoose.disconnect();
      this.connected = false;
      console.log("[DB] Disconnected");
    }
  }
}

module.exports = new DBConnection(); // Singleton instance
