const path = require("path");
const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error.middleware");
require("dotenv").config();
require("express-async-errors"); // captures async errors

// import route files
const authRoutes = require("./routes/auth.routes");
const farmerRoutes = require("./routes/farmer.routes");
const customerRoutes = require("./routes/customer.routes");
const chatRoutes = require("./routes/chat.routes");
const pestRoutes = require("./routes/pest.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const adminRoutes = require("./routes/admin.routes");
const mapRoutes = require("./routes/map.routes");
const marketplaceRoutes = require("./routes/marketplace.routes");
const profileRoutes = require("./routes/profile.routes");
const cropRoutes = require("./routes/crop.routes");
const notificationRoutes = require("./routes/notification.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const trendingRoutes = require("./routes/trending.routes");

const adminControlRoutes = require("./routes/adminControl.routes");
const buyerRecommendationRoutes = require("./routes/buyerRecommendation.routes");
const aiRoutes = require("./routes/ai.routes");

// initialize DB
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// mount routers (routers import controller instances directly)
app.use("/api/auth", authRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/pest", pestRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/map", mapRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/trending", trendingRoutes);

app.use("/api/admin-control", adminControlRoutes);
app.use("/api/buyer-recommendation", buyerRecommendationRoutes);
app.use("/api/ai", aiRoutes);

// health
app.get("/", (req, res) => res.send("FarmConnect API running"));

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
