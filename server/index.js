require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan")
const PORT = 3000;

//http logs
app.use(morgan('dev'));
// Middleware to parse JSON bodies
app.use(express.json());
app.use("/api", require("./routes/index"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
