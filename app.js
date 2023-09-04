const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

//routes
const xiRoutes = require("./Api/routes/xi");

mongoose
  .connect(
    `mongodb+srv://oparadaniv:${process.env.my_pass_key}@world-xi.bdrzpea.mongodb.net/`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 5000,
      dbName: "Players-XI",
    }
  )
  .then(() => {
    console.log("Connected to port 2020");
  })
  .catch((err) => {
    console.log("error connection to port 2020 " + err);
  });

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/xi", xiRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
