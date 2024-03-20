var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// var indexRouter = require("./routes/index");
var MemoServiceRouter = require("./routes/MemoService");
var UserServiceRouter = require("./routes/UserService");

const PORT = process.env.PORT || 3000;

var app = express();

// NOTE: IGNORE -- default template setup via `npx express-generator`
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// ============== Setup Middleware ==============
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ============== Setup Routes ==============
// app.use("/", indexRouter);
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use("/api/memos", MemoServiceRouter);
app.use("/api/users", UserServiceRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@372-proj.3a6gakd.mongodb.net/?retryWrites=true&w=majority&appName=372-proj`
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((e) => console.error("Failed to connect to Mongo: ", e));
