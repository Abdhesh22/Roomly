require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./connection/db.connection");
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Hello from Node.js Server!");
});

// Example POST route
app.post("/api/data", (req, res) => {
  const data = req.body;
  console.log("Received data:", data);
  res.json({ message: "Data received successfully!", data });
});

//Connecting Db

(async () => {
  try {
    await db.connect(process.env.MONGO_DB_CONNECTION_URL);
    console.log("Db has been connected");
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
