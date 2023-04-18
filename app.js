const bodyParser = require("body-parser");
const passport = require("passport");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");
const session = require("express-session");
const moment = require("moment");
const User = require("./models/User");
require("./services/passport");
const app = express();

/* The above code is connecting to the database. */
connectDB();

app.use(fileUpload());
// app.use(express.static("Client/public"));
app.use(express.static("Client/build"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
  //allow cross origin requests
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, PUT, OPTIONS, DELETE, GET"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 4 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// console.log(Date.now());

app.use("/uploads", express.static("uploads"));

//protected routes
app.use("/api", require("./routes/protected"));

//external routes
app.use(require("./routes/external"));

app.use(require("./routes/externalApis/eduonline"));
app.use(require("./routes/externalApis/nova"));
app.listen(process.env.PORT || 9000, function () {
  console.log("The Server is Listening!!!");
});
