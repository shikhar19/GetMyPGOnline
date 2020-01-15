const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
var favicon = require("serve-favicon");

const app = express();

mongoose.set("useCreateIndex", true);
require("./config/dbconnection");

app.use(cors({ exposedHeaders: "x-auth-token" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "css", "assets", "icon.png")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", (req, res) => {
  return res.status(200).render("index.ejs");
});

app.get("/register", (req, res) => {
  return res.status(200).render("register.ejs");
});

const User = require("./models/User");
const Pg = require("./models/Pg");
const DeletedUsers = require("./models/DeletedUsers");

app.use("/api/users", require("./routes/user"));
app.use("/api/pgs", require("./routes/pg"));

app.get("*", (req, res) => {
  res.status(404).render("404.ejs");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
