const express = require("express");
const mysql = require("mysql");

const app = express();

// set the view engine to ejs
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("login");
});

//have app listen on specifc port
app.listen("3000", () => {
  console.log("Server is running on Port 3000");
});
