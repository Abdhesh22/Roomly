require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();

const PORT = process.env.PORT || 3000;

// Logging and parsing
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", require("./routes/index"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
