const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const { UCS2_PERSIAN_CI } = require("mysql/lib/protocol/constants/charsets");
const session = require("express-session");
const path = require("path");
const app = express();
const favicon = require("serve-favicon");

// create connection
const db = mysql.createConnection({
  host: process.env.DATABASE_host,
  port: "3306",
  user: "root",
  password: "root",
  database: "test1",
});
// connect to database
db.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("MySql Connected");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.static(__dirname + "/public"));

//set view engine to ejs
app.set("view engine", "ejs");

//***********GET FUNCTIONS***************
//first time DB setup
app.get("/create", (req, res) => {
  let table1 =
    "CREATE TABLE SPW_Plants (PlantID integer NOT NULL AUTO_INCREMENT, PlantName varchar(50), PlantCreated TIMESTAMP, PRIMARY KEY (PlantID))";
  db.query(table1, (err, result) => {
    if (err) throw err;
    console.log("table1 is created...");
  });
  let table2 =
    "CREATE TABLE SPW_Floors (FloorID integer NOT NULL AUTO_INCREMENT, PlantID integer, FloorName varchar(50), FloorCreated TIMESTAMP, PRIMARY KEY (FloorID, PlantID),  FOREIGN KEY (PlantID) REFERENCES SPW_Plants(PlantID))";
  db.query(table2, (err, result) => {
    if (err) throw err;
    console.log("table2 is created...");
  });
  let table3 =
    "CREATE TABLE SPW_Machines (MachineID integer NOT NULL AUTO_INCREMENT, FloorID integer, PlantID integer, MachineName varchar(50), MachineCreated TIMESTAMP, PRIMARY KEY (MachineID), FOREIGN KEY (PlantID, FloorID) REFERENCES SPW_Floors(PlantID, FloorID))";
  db.query(table3, (err, result) => {
    if (err) throw err;
    console.log("table3 is created...");
  });
  let table4 =
    "CREATE TABLE SPW_Data (DataID integer NOT NULL AUTO_INCREMENT, MachineID integer, DataName varchar(50), DataCreated TIMESTAMP, PRIMARY KEY (DataID, MachineID),  FOREIGN KEY (MachineID) REFERENCES SPW_Machines(MachineID))";
  db.query(table4, (err, result) => {
    if (err) throw err;
    console.log("table4 is created...");
  });
  let table5 =
    "CREATE TABLE SPW_Shifts (ShiftID integer NOT NULL AUTO_INCREMENT, ShiftName varchar(50), TimeOfDay varchar(50), ShiftCreated TIMESTAMP, PRIMARY KEY (ShiftID))";
  db.query(table5, (err, result) => {
    if (err) throw err;
    console.log("table5 is created...");
  });
  let table6 =
    "CREATE TABLE SPW_Users (UserID integer NOT NULL AUTO_INCREMENT, Username varchar(50), Password varchar(50), PermissionLevel integer, UserCreated TIMESTAMP, PRIMARY KEY (UserID))";
  db.query(table6, (err, result) => {
    if (err) throw err;
    console.log("table6 is created...");
  });
  let table7 =
    "CREATE TABLE SPW_UserShifts (UserShiftID integer NOT NULL AUTO_INCREMENT, UserID integer, ShiftID integer, PRIMARY KEY (UserShiftID, UserID, ShiftID), FOREIGN KEY (ShiftID) REFERENCES SPW_Shifts(ShiftID),  FOREIGN KEY (UserID) REFERENCES SPW_Users(UserID))";
  db.query(table7, (err, result) => {
    if (err) throw err;
    console.log("table7 is created...");
  });
  let table8 =
    "CREATE TABLE SPW_MachineData (DataID integer, MachineDataID integer, MachineID integer,UserShiftID integer,UserID integer,ShiftID integer,number varchar(50), string varchar(50), Bool bit, TimeCreated TIMESTAMP, PRIMARY KEY (MachineDataID, MachineID, DataID), FOREIGN KEY (MachineID) REFERENCES SPW_Machines(MachineID), FOREIGN KEY (UserShiftID, UserID, ShiftID) REFERENCES SPW_UserShifts(UserShiftID, UserID, ShiftID), FOREIGN KEY (DataID) REFERENCES SPW_Data(DataID))";
  db.query(table8, (err, result) => {
    if (err) throw err;
    console.log("table8 is created...");
    res.send("ALL TABLES COMPLETE...");
  });
});

app.get("/", function (req, res) {
  res.render("login", {
    errorMessage: "",
  });
});

app.get("/userspage", function (req, res) {
  var query = "select * from SPW_Users";

  db.query(query, function (err, result) {
    if (err) throw err;
    else {
      res.render("adminPage/users", {
        pagename: "Users",
        firstName: "Brinkley",
        navlinkdashboard: "",
        navlinkdata: "",
        navlinkshifts: "",
        navlinkusers: "active",
        navlinkreports: "",
        navlinklocations: "",
        users: result,
      });
    }
  });
});

function productUpdate(){
  for (var u = 0; u < users.length; u++)
  var username = users[u].UserName;
  var password = users[u].Password;
  var permlevel = users[u].PermissionLevel;
    let table8 =
    `UPDATE SPW_Users(Username, Password, PermissionLevel) VALUES ("${username}", "${password}", "${permlevel}") WHERE UserID = "${u}"`;
    db.query(sql, function (err, result) {
      if (err) throw err;
    });
  };

app.get("/datapage", function (req, res) {
  res.render("adminPage/data", {
    pagename: "Data",
    navlinkdashboard: "",
    navlinkdata: "active",
    navlinkshifts: "",
    navlinkusers: "",
    navlinkreports: "",
    navlinklocations: "",
  });
});

app.get("/shiftspage", function (req, res) {
  var query = "select * from SPW_Shifts";

  db.query(query, function (err, result) {
    if (err) throw err;
    else {
      res.render("adminPage/shifts", {
        pagename: "Shifts",
        navlinkdashboard: "",
        navlinkdata: "",
        navlinkshifts: "active",
        navlinkusers: "",
        navlinkreports: "",
        navlinklocations: "",
        shifts: result,
      });
    }
});
});

app.get("/reportspage", function (req, res) {
  res.render("adminPage/reports", {
    pagename: "Reports",
    navlinkdashboard: "",
    navlinkdata: "",
    navlinkshifts: "",
    navlinkusers: "",
    navlinkreports: "active",
    navlinklocations: "",
  });
});

app.get("/locationspage", function (req, res) {
  res.render("adminPage/locations", {
    pagename: "Locations",
    navlinkdashboard: "",
    navlinkdata: "",
    navlinkshifts: "",
    navlinkusers: "",
    navlinkreports: "",
    navlinklocations: "active",
  });
});

app.get("/404", function (req, res) {
  res.render("404", {
    errorMessage: "",
  });
});

//stuff for practice
app.get("/jared", (req, res) => {
  let sql =
    "INSERT INTO SPW_Users(Username, Password, PermissionLevel) VALUES ('jared', 'hello', '4');";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log("name is created...");
    res.send("name is COMPLETE...");
  });
});

app.get("/branson", (req, res) => {
  let sql =
    "SELECT UserID, Username, Password, PermissionLevel FROM SPW_Users; ";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log("display is created...");
    res.send(result);
  });
});

//***********POST FUNCTIONS***************
app.post("/newuser", function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var permlevel = req.body.permlevel;
  console.log(username, password, permlevel);

  var sql = `INSERT INTO SPW_Users(Username, Password, PermissionLevel) VALUES ("${username}", "${password}", "${permlevel}")`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
    res.redirect("/userspage");
  });
});

app.post("/newshift", function (req, res, next) {
  var shift = req.body.shift;
  var shiftTime = req.body.shiftTime;
  console.log(shift, shiftTime);

  var sql = `INSERT INTO SPW_Shifts(ShiftName, TimeOfDay) VALUES ("${shift}", "${shiftTime}")`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
    res.redirect("/shiftspage");
  });
});

app.post("/auth", function (request, response) {
  // Capture the input fields
  let username = request.body.username;
  let password = request.body.password;
  // Ensure the input fields exists and are not empty
  if (username && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    db.query(
      "SELECT * FROM SPW_Users WHERE username = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        // If the account exists
        if (results.length > 0) {
          if (results[0].PermissionLevel >= 3) {
            response.redirect("/datapage");
          } else if (results[0].PermissionLevel < 3) {
            response.redirect("/userspage");
          }
        } else {
          response.render("login", {
            errorMessage: "Incorrect Username or Password",
          });
        }
        response.end();
      }
    );
  } else {
    response.render("login", {
      errorMessage: "Please Enter Username and Password",
    });
    response.end();
  }
});

//have app listen on specifc port
app.listen("3000", () => {
  console.log("Server is running on Port 3000");
});
