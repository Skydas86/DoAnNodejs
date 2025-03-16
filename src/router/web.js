// //cau hinh routes tren web
const {ABC, getUsers} = require('../controllers/homeController')
const express = require('express');
const router = express.Router();

//router.Method("/route",handler)
router.get('/', (req, res) => {
  res.render('home.ejs')
});
router.get('/demo2', ABC );
router.get('/demo', (req, res) => {
    res.render('sample.ejs')
  });
  
  router.get('/homepage', (req, res) => {
    res.render('homepage.ejs')
  });

module.exports = router;