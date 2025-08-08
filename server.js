require("dotenv").config();
require("express-async-errors"); // captures async errors
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/error.middleware");

// initialize DB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// mount routers (routers import controller instances directly)
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/farmer", require("./routes/farmer.routes"));
app.use("/api/customer", require("./routes/customer.routes"));
app.use("/api/chat", require("./routes/chat.routes"));
app.use("/api/pest", require("./routes/pest.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/map", require("./routes/map.routes"));
app.use("/api/marketplace", require("./routes/marketplace.routes"));

// health
app.get("/", (req, res) => res.send("FarmConnect API running"));

// global error handler (must be after routes)
app.use(errorHandler);

// graceful shutdown
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  logger.info(`Server running on port ${PORT}`)
);

process.on("SIGINT", async () => {
  logger.info("SIGINT received. Shutting down gracefully.");
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
});
