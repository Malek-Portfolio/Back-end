require("dotenv").config()

const cors = require("cors")
const rateLimiter = require("express-rate-limit")

const express = require("express");


const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

const mongoose = require("mongoose");


mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection;

db.on("error", (err) => {
  console.error(err);
});

db.once("open", () => {
  console.log("connected to Database");
});

app.use(express.json())

const projectsRouter = require("./routes/projects")

app.use("/projects" , projectsRouter)


const contactRouter = require("./routes/contact")

const contactLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many contact attempts from this IP, please try again later"
})

app.use("/contact" , contactLimiter ,contactRouter )

app.listen(3001, () => {
  console.log("server has started");
})