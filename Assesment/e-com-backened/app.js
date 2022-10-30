require('express-async-errors'); //error handle korar jonno "npm i express-async-errors"
const express = require('express');
const error = require('./middlewares/error');
const app = express();


require('./middlewares/index')(app);
require('./middlewares/routes')(app);



app.use(error);


module.exports = app;
