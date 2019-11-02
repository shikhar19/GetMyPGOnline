const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

mongoose.set("useCreateIndex", true);
require("./config/dbconnection");

app.use(cors({ exposedHeaders: "x-auth-token" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

app.get("/", (req, res) => {
	return res.status(200).json({
		message: "PG Online!"
	});
});

const User = require("./models/User");
const Pg = require("./models/Pg");

app.use("/api/users", require("./routes/user"));
app.use("/api/pgs", require("./routes/pg"));

app.get("*", (req, res) => {
  res.status(404).json({
    message: "Page Not Found"
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
