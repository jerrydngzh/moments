var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 8080;
const DB_NAME = process.env.DB_NAME || "test";

var indexRouter = require("./routes/index");
var MemoServiceRouter = require("./routes/MemoService");
var UserServiceRouter = require("./routes/UserService");
var app = express();

// ============== Setup Middleware ==============
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ============== Setup Routes ==============
app.use("/", indexRouter);
app.use("/api/memos", MemoServiceRouter);
app.use("/api/users", UserServiceRouter);

// ========= Error Handling Middleware =========
app.use(function (err, req, res, next) {
  console.log(err.stack);

  // Set status of response
  res.status(err.status || 500);

  // Send response
  res.json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

// Connect to DB
mongoose.set("strictQuery", false);

// NOTE: for local MongoDB
// mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`)
//     .then(() => {
//       console.log('Connected to MongoDB...');
//       app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//       })
//     })
//     .catch(err => console.error('Could not connect to MongoDB...', err));

// NOTE: for MongoDB Atlas
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
