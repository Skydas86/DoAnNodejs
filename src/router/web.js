// //cau hinh routes tren web
const {ABC, getUsers} = require('../controllers/homeController')
const express = require('express');
const router = express.Router();

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
  
module.exports = router;