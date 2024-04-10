const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Multer = require('multer')
dotenv.config();

const PORT = process.env.PORT || 8080;

const indexRouter = require("./routes/index");
const MemoServiceRouter = require("./routes/MemoService");
const UserServiceRouter = require("./routes/UserService");
const ProfileServiceRouter = require("./routes/ProfileService");
const MediaServiceRouter = require("./routes/MediaService");
const app = express();

// ============== Setup Middleware ==============
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
})

app.use(multer.any())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


// ============== Setup Routes ==============
app.use("/", indexRouter);
app.use("/api/memos", MemoServiceRouter);
app.use("/api/users", UserServiceRouter);
app.use("/api/profiles", ProfileServiceRouter);
app.use("/api/media", MediaServiceRouter);

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
mongoose.connect(`mongodb://localhost:27017/test`) // my mongodbcompass has a test db - vince
  .then(() => {
    console.log('Connected to MongoDB...');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  })
  .catch(err => console.error('Could not connect to MongoDB...', err));

// NOTE: for MongoDB Atlas
// mongoose
//   .connect(
//     `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@372-proj.3a6gakd.mongodb.net/?retryWrites=true&w=majority&appName=372-proj`
//   )
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((e) => console.error("Failed to connect to Mongo: ", e));
