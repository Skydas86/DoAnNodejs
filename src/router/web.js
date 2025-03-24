const express = require('express');
const router = express.Router();
const { register, login, getUserSession, requireAuth} = require("../controllers/authController");
const { renderDashboard } = require('../controllers/adminController');


router.use('/api', require('./api'));
  
  router.get("/", (req, res) => {
    res.render("homepage.ejs", { user: req.session.user || null });
  });
  
  router.get('/dashboard', renderDashboard);

  router.post("/login", login);
  router.get("/login", requireAuth, (req, res) => { 
    if (req.session.user) {
      return res.redirect("/"); 
    }
    res.render("login");
  });
  
  router.post("/register", register);
  router.get('/register', (req, res) => {
    res.render('register.ejs')
  });
  
  router.get("/logout-confirm", (req, res) => {
    res.render("logout");
  });
  router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Không thể đăng xuất!" });
        }
        res.redirect("/login");
    });
  });

  router.get("/get-user", (req, res) => {
    if (req.session.user) {
      return res.json({ user: req.session.user });
    } else {
      return res.status(401).json({ error: "Người dùng chưa đăng nhập!" });
    }
  });

module.exports = router;