require('dotenv').config()
const mysql = require('mysql2');
const express = require('express')
const configViewEngine = require('./router/viewEngine');
const webRoutes = require('./router/web');
const app = express()


//check env
//console.log(">> check env: ", process.env);


const port = process.env.PORT||8080;
const hostname = process.env.HOST_NAME;

configViewEngine(app);
app.use('/',webRoutes);
//app.use(express.static('public'));

app.listen(3000, function() {
  console.log('Node server running @ http://localhost:3000');
});