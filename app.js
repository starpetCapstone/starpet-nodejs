const express = require("express");
const mysql = require("mysql2");

const app = express();

// create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "GGGhhh442!",
});

// connec to database
db.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("MySql Connected");
});

//create DB
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE JARED";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("db created...");
  });
});
// set the view engine to ejs
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("login");
});

//have app listen on specifc port
app.listen("3000", () => {
  console.log("Server is running on Port 3000");
});
