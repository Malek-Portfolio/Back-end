require("dotenv").config()

const express = require("express");


const app = express();

const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);

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

app.listen(3001, () => {
  console.log("server has started");
});
