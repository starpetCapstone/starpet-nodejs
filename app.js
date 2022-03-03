const express = require("express");
const mysql = require("mysql");

const app = express();
app.listen("3000", () => {
  console.log("Server is running on Port 3000");
});

app.get("/", function (req, res) {
  res.send("Hello World!");
});
