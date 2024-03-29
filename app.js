var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');





const brandsRouter   = require('./routes/brands')
const productsRouter = require('./routes/products')
const categoriesRouter = require('./routes/category')
const usersRouter = require('./routes/users')
const loginRouter = require('./routes/auth')


var app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, 'public')));

app.use('/brands', brandsRouter);
app.use('/products', productsRouter);
app.use('/category', categoriesRouter);
app.use('/users', usersRouter);
app.use('/auth', loginRouter);

module.exports = app;
