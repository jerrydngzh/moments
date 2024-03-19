var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient } = require('mongodb');

// var indexRouter = require('./routes/index');
const MemoServiceRouter = require('./routes/MemoService');
const UserServiceRouter = require('./routes/UserService');

dotenv.config();

// MongoDB connection string
const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'Moments';


const PORT = process.env.PORT || 3000;

var app = express();

// NOTE: IGNORE -- default template setup via `npx express-generator`
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// ============== Setup Middleware ==============
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ============== Setup Routes ==============
// app.use('/', indexRouter);
app.use('/api/memos', MemoServiceRouter);
app.use('/api/users', UserServiceRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// MongoDB client initialization and connection
const client = new MongoClient(uri);

client.connect()
  .then(() => {
    console.log('Connected to MongoDB');

    // Access the database
    const db = client.db(dbName);

    // Start the server after connecting to MongoDB
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
