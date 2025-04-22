require("dotenv").config();

const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const express = require("express");

const app = express();
app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;

db.on("error", (err) => {
  console.error(err);
});

db.once("open", () => {
  console.log("connected to Database");
});
app.use(express.json());

const projectsRouter = require("./routes/projects");

app.use("/projects", projectsRouter);

const contactRouter = require("./routes/contact");

// const contactLimiter = rateLimiter({
//   windowMs: 5 * 60 * 1000,
//   max: 10,
//   message: "Too many contact attempts from this IP, please try again later",
// });

app.use("/contact", contactRouter);

app.listen(3001, () => {
  console.log("server has started");
});
