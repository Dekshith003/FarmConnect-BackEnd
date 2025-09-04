require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error.middleware");
require("express-async-errors"); // captures async errors

// import route files
const treatmentRoutes = require("./routes/treatment.routes");
const authRoutes = require("./routes/auth.routes");
const farmerRoutes = require("./routes/farmer.routes");
const customerRoutes = require("./routes/customer.routes");
const pestRoutes = require("./routes/pest.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const adminRoutes = require("./routes/admin.routes");
const mapRoutes = require("./routes/map.routes");
const marketplaceRoutes = require("./routes/marketplace.routes");
const profileRoutes = require("./routes/profile.routes");
const cropRoutes = require("./routes/crop.routes");
const notificationRoutes = require("./routes/notification.routes");
const trendingRoutes = require("./routes/trending.routes");
const adminControlRoutes = require("./routes/adminControl.routes");
const aiRoutes = require("./routes/ai.routes");

// initialize DB
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.use(
  "/uploads/pest-images",
  express.static(path.join(__dirname, "uploads/pest-images"))
);

app.use(
  "/uploads/crop-images",
  express.static(path.join(__dirname, "uploads/crop-images"))
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "dist")));

// mount routers (routers import controller instances directly)
app.use("/api/treatment", treatmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/pest", pestRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/map", mapRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/trending", trendingRoutes);
app.use("/api/admin-control", adminControlRoutes);
app.use("/api/ai", aiRoutes);

// health
app.get("/", (req, res) => res.send("FarmConnect API running"));

// catch-all route to serve React app for any unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// global error handler (must be after routes)
app.use(errorHandler);

// graceful shutdown
const PORT = process.env.PORT || 5001;
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
