require("dotenv").config();
const express = require("express");
const cors = require("cors");
const configViewEngine = require("./router/viewEngine");
const webRoutes = require("./router/web");
//const authRoutes = require("./router/authRoutes");

const app = express();
const port = process.env.PORT || 8080;

configViewEngine(app);
app.use(express.json());
app.use(cors());
app.use("/", webRoutes);
app.use("/register", webRoutes);

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error("Lỗi hệ thống:", err);
  res.status(500).json({ error: "Lỗi hệ thống!" });
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
