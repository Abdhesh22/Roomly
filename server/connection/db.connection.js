const mongoose = require("mongoose");

class DBConnection {
  constructor() {
    this._connectionPromise = null;
    this._uri = process.env.MONGO_DB_CONNECTION_URL;
  }

  async getMongoose() {
    if (mongoose.connection.readyState === 1) {
      console.log("[DB] Already connected");
      return mongoose;
    }

    if (!this._connectionPromise) {
      this._connectionPromise = this._connect();
    }

    return this._connectionPromise;
  }

  async _connect() {
    try {
      await mongoose.connect(this._uri);
      console.log("[DB] Connection established");
      return mongoose;
    } catch (error) {
      console.error("[DB] Connection failed:", error.message);
      throw error;
    }
  }

  async disconnect() {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      this._connectionPromise = null;
      console.log("[DB] Disconnected");
    }
  }
}

// Export a singleton instance
module.exports = new DBConnection();