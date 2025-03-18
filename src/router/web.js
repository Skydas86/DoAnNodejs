// //cau hinh routes tren web
const {ABC, getUsers} = require('../controllers/homeController')
const express = require('express');
const router = express.Router();
const { register, login } = require("../controllers/authController");

//router.Method("/route",handler)

router.get('/demo2', ABC );
router.get('/demo', (req, res) => {
    res.render('sample.ejs')
  });
  
  router.get('/', (req, res) => {
    res.render('homepage.ejs')
  });

  router.get('/login', (req, res) => {
    res.render('login.ejs')
  });
  router.post("/login", login);
  router.get('/register', (req, res) => {
    res.render('register.ejs')
  });
  router.post("/register", register);

module.exports = router;