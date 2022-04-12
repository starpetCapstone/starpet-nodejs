const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const { UCS2_PERSIAN_CI } = require("mysql/lib/protocol/constants/charsets");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcrypt");
const app = express();
const favicon = require("serve-favicon");
const saltRounds = 10;
var LOGGEDIN = Boolean(false);
var NAME;
// create connection
const db = mysql.createConnection({
  host: process.env.DATABASE_host,
  port: "8889",
  user: "brinkley",
  password: "hello",
  database: "test5",
  multipleStatements: true,
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
app.get("/create", async (req, res) => {
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
    "CREATE TABLE SPW_DataTypes (DataTypesID integer NOT NULL AUTO_INCREMENT, Label varchar(50), Type varchar(50), Unit varchar(50), TimeCreated TIMESTAMP, PRIMARY KEY (DataTypesID))";
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
    "CREATE TABLE SPW_Users (UserID integer NOT NULL AUTO_INCREMENT, Username varchar(50), Password varchar(250), PermissionLevel integer, UserCreated TIMESTAMP, PRIMARY KEY (UserID))";
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
  let encryptedAdminPassword = await bcrypt.hash("admin", saltRounds);
  let adminProfile = `INSERT INTO SPW_Users(Username, Password, PermissionLevel) VALUES ("admin", "${encryptedAdminPassword}", "4")`;
  db.query(adminProfile, function (err, result) {
    if (err) throw err;
    console.log("record inserted");
  });
  let table8 =
    "CREATE TABLE SPW_MachineData (DataTypesID integer, MachineDataID integer, MachineID integer, UserShiftID integer, UserID integer, ShiftID integer, Value varchar(50), TimeCreated TIMESTAMP, PRIMARY KEY (MachineDataID), FOREIGN KEY (MachineID) REFERENCES SPW_Machines(MachineID), FOREIGN KEY (UserShiftID, UserID, ShiftID) REFERENCES SPW_UserShifts(UserShiftID, UserID, ShiftID), FOREIGN KEY (DataTypesID) REFERENCES SPW_DataTypes(DataTypesID))";
  db.query(table8, (err, result) => {
    if (err) throw err;
    console.log("table8 is created...");
    res.render("login", {
      errorMessage: "‎",
    });
  });
});

app.get("/", function (req, res) {
  let sql = "SELECT Username FROM SPW_Users; ";
  res.render("login", {
    errorMessage: "‎",
  });
});

app.get("/signout", function (req, res) {
  res.render("login", {
    errorMessage: "Signed out successfully.",
  });
  LOGGEDIN = false;
});

app.get("/userspage", function (req, res) {
  var query = "select * from SPW_Users";

  if (LOGGEDIN) {
    db.query(query, function (err, result) {
      if (err) throw err;
      else {
        res.render("adminPage/users", {
          pagename: "Users",
          name: NAME,
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
  } else {
    res.render("login", {
      errorMessage: "Please login :)",
    });
  }
});

app.get("/datapage", function (req, res) {
  var query = "select * from SPW_DataTypes";

  db.query(query, function (err, result) {
    if (err) throw err;
    else {
      res.render("adminPage/data", {
        pagename: "Data",
        name: NAME,
        navlinkdashboard: "",
        navlinkdata: "active",
        navlinkshifts: "",
        navlinkusers: "",
        navlinkreports: "",
        navlinklocations: "",
        shifts: result,
      });
    }
  });
});

app.get("/shiftspage", function (req, res) {
  var query = "select * from SPW_Shifts";

  db.query(query, function (err, result) {
    if (err) throw err;
    else {
      res.render("adminPage/shifts", {
        pagename: "Shifts",
        name: NAME,
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
    name: NAME,
    navlinkdashboard: "",
    navlinkdata: "",
    navlinkshifts: "",
    navlinkusers: "",
    navlinkreports: "active",
    navlinklocations: "",
  });
});

app.get("/locationspage", function (req, res) {
  if (LOGGEDIN) {
    res.render("adminPage/locations", {
      pagename: "Locations",
      name: NAME,
      navlinkdashboard: "",
      navlinkdata: "",
      navlinkshifts: "",
      navlinkusers: "",
      navlinkreports: "",
      navlinklocations: "active",
    });
  } else {
    res.render("login", {
      errorMessage: "Please login :)",
    });
  }
});

app.get("/techpage", function (req, res) {
  var query = "select * from SPW_Plants; select * from SPW_Floors;";
  db.query(query, function (err, result) {
    if (err) throw err;
    else {
      console.log(result[0]);
      res.render("techPage/home", {
        name: NAME,
        plants: result[0],
        floors: result[1],
      });
    }
  });
});

app.get("/404", function (req, res) {
  res.render("404", {
    errorMessage: "",
  });
});

app.put("/editUser", function (req, res, next) {
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

//***********POST FUNCTIONS***************
app.post("/newuser", async function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, saltRounds);
  var permlevel = req.body.permlevel;

  var sql = `INSERT INTO SPW_Users(Username, Password, PermissionLevel) VALUES ("${username}", "${encryptedPassword}", "${permlevel}")`;
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

app.post("/auth", async function (request, response) {
  // Capture the input fields
  let username = request.body.username;
  let password = request.body.password;

  db.query(
    "SELECT * FROM SPW_Users WHERE username = ?",
    [username],
    async function (error, results, fields) {
      // If there is an issue with the query, output the error
      if (error) throw error;

      // If the account exists
      if (results.length > 0) {
        const comparison = await bcrypt.compare(password, results[0].Password);
        if (comparison) {
          NAME = results[0].Username;
          LOGGEDIN = true;
          console.log(LOGGEDIN);
          if (results[0].PermissionLevel >= 3) {
            response.redirect("/datapage");
          } else if (results[0].PermissionLevel < 3) {
            response.redirect("/userspage");
          }
        } else {
          response.render("login", {
            errorMessage: "Incorrect Password",
          });
        }
        response.end();
      } else {
        response.render("login", {
          errorMessage: "Username does not exist",
        });
        response.end();
      }
    }
  );
});

//have app listen on specifc port
app.listen("3000", () => {
  console.log("Server is running on Port 3000");
});
