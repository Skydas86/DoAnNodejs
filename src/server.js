require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./config/db"); 
const express = require("express");
const cors = require("cors");
const configViewEngine = require("./router/viewEngine");
const webRoutes = require("./router/web");
const { QueryTypes } = require("sequelize");

const app = express();
const port = process.env.PORT || 3000;
const hostname = process.env.HOST_NAME;

configViewEngine(app);
app.use(express.json());
app.use(cors()); 
app.use("/", webRoutes);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

app.post("/register", async (req, res) => {
  try {
    const { Username, Password, Email, CardNumber, RoleId } = req.body;

    if (!Username || !Password || !Email || !CardNumber || !RoleId) {
      return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin!" });
    }

    const roleIdNum = Number(RoleId); 
    if (isNaN(roleIdNum)) {
      return res.status(400).json({ error: "RoleId phải là số!" });
    }

    if (!isValidEmail(Email)) {
      return res.status(400).json({ error: "Email không hợp lệ!" });
    }

    const checkRoleSql = "SELECT RoleId FROM roles WHERE RoleId = ?";
    const roleResult = await db.query(checkRoleSql, {
      replacements: [roleIdNum],
      type: QueryTypes.SELECT,
    });

    const checkEmailSql = "SELECT Email FROM users WHERE Email = ?";
    const emailResult = await db.query(checkEmailSql, {
      replacements: [Email],
      type: QueryTypes.SELECT,
    });

    console.log("Kiểm tra Email:", emailResult);

    if (emailResult.length > 0) {
      return res.status(400).json({ error: "Email đã được sử dụng!" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const sql = "INSERT INTO users (Username, Password, Email, CardNumber, RoleId) VALUES (?, ?, ?, ?, ?)";
    await db.query(sql, {
      replacements: [Username, hashedPassword, Email, CardNumber, roleIdNum],
      type: QueryTypes.INSERT,
    });

    res.json({ message: "Đăng ký thành công!" });

  } catch (error) {
    console.error("Lỗi Server:", error);
    res.status(500).json({ error: "Lỗi hệ thống!" });
  }
});

app.use((err, req, res, next) => {
  console.error("Lỗi hệ thống:", err);
  res.status(500).json({ error: "Lỗi hệ thống!" });
});

app.listen(3000, () => {
  console.log("Server chạy tại http://localhost:3000");
});
