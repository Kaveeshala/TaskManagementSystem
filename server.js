const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./config/database");

dotenv.config();
const app = express();

// Models
const User = require("./models/User");
const Task = require("./models/Task");

// Middleware – always put BEFORE routes
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require("./routes/tasksRoutes");

app.use('/api/users', userRoutes);
app.use("/api", taskRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is healthy!" });
});

// DB Connection
sequelize
  .authenticate()
  .then(() => console.log("PostgreSQL connected!"))
  .catch((err) => console.error("DB connection error:", err));

// Sync models
sequelize
  .sync({ alter: true })
  .then(() => console.log("Models synchronized"))
  .catch((err) => console.error("Model sync error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
