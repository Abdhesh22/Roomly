require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const CronJobController = require("./controller/cron-job/cron-job.controller");


// Allow only your frontend domain
app.use(cors({
  origin: process.env.ALLOWED_HOST,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Logging and parsing
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// API routes
app.use("/api", require("./routes/index"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

(async function initCron() {
  const cronJobs = new CronJobController();
  cronJobs.initCron();
  console.log("[CRON] Cron jobs initialized");
})();
