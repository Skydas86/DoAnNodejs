const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Import thư viện jsonwebtoken
const db = require("../config/db");
const { QueryTypes } = require("sequelize");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const register = async (req, res) => {
  try {
    const { Username, Password, Email, CardNumber, RoleId } = req.body;

    if (!Username || !Password || !Email || !CardNumber) {
      return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin!" });
    }

    if (!isValidEmail(Email)) {
      return res.status(400).json({ error: "Email không hợp lệ!" });
    }

    const roleIdNum = RoleId ? Number(RoleId) : 2; // Mặc định RoleId = 2 nếu không có
    if (isNaN(roleIdNum)) {
      return res.status(400).json({ error: "RoleId phải là số!" });
    }

    const checkRoleSql = "SELECT RoleId FROM roles WHERE RoleId = ?";
    const roleResult = await db.query(checkRoleSql, {
      replacements: [roleIdNum],
      type: QueryTypes.SELECT,
    });

    if (roleResult.length === 0) {
      return res.status(400).json({ error: "RoleId không hợp lệ!" });
    }

    const checkEmailSql = "SELECT Email FROM users WHERE Email = ?";
    const emailResult = await db.query(checkEmailSql, {
      replacements: [Email],
      type: QueryTypes.SELECT,
    });

    if (emailResult.length > 0) {
      return res.status(400).json({ error: "Email đã được sử dụng!" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const sql =
      "INSERT INTO users (Username, Password, Email, CardNumber, RoleId) VALUES (?, ?, ?, ?, ?)";
    await db.query(sql, {
      replacements: [Username, hashedPassword, Email, CardNumber, roleIdNum],
      type: QueryTypes.INSERT,
    });

    res.json({ message: "Đăng ký thành công!" });
  } catch (error) {
    console.error("Lỗi Server:", error);
    res.status(500).json({ error: "Lỗi hệ thống!" });
  }
};

const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!Email || !Password) {
      return res.status(400).json({ error: "Vui lòng nhập email và mật khẩu!" });
    }

    // Truy vấn người dùng từ cơ sở dữ liệu
    const userSql = "SELECT * FROM users WHERE Email = ?";
    const userResult = await db.query(userSql, {
      replacements: [Email],
      type: QueryTypes.SELECT,
    });

    // Kiểm tra xem email có tồn tại không
    if (userResult.length === 0) {
      return res.status(400).json({ error: "Email không tồn tại!" });
    }

    const user = userResult[0];

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ error: "Mật khẩu không đúng!" });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { UserId: user.UserId, RoleId: user.RoleId },
      process.env.JWT_SECRET, // Sử dụng biến môi trường
      { expiresIn: "1h" }
    );

    // Phản hồi thành công
    res.json({ message: "Đăng nhập thành công!", token });
  } catch (error) {
    console.error("Lỗi Server:", error);

    // Phản hồi lỗi chi tiết hơn
    if (error.name === "SequelizeConnectionError") {
      return res.status(500).json({ error: "Lỗi kết nối cơ sở dữ liệu!" });
    }

    res.status(500).json({ error: "Lỗi hệ thống!" });
  }
};

module.exports = { register, login };