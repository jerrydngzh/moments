var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || 'db';

var indexRouter = require('./routes/index');
var MemoServiceRouter = require('./routes/MemoService');
var UserServiceRouter = require('./routes/UserService');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// ============== Setup Middleware ==============
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ============== Setup Routes ==============
app.use('/', indexRouter);
app.use('/api/memos', MemoServiceRouter);
app.use('/api/users', UserServiceRouter);

// ========= Error Handling =========
// app.use(express.static(path.join(__dirname, 'public')));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Connect to DB 
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`)
    .then(() => {
      console.log('Connected to MongoDB...');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      })
    })
    .catch(err => console.error('Could not connect to MongoDB...', err));
