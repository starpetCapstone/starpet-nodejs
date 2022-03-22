const express = require("express");
const mysql = require("mysql2");

const app = express();
// create connection
const db = mysql.createConnection({
  host: "localhost",
  port: "8889",
  user: "brinkley",
  password: "hello",
  database: "test1",
});

// connec to database
db.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("MySql Connected");
});

//create DB
app.get("/create", (req, res) => {
  let table1 =
    "CREATE TABLE SPW_Plants (PlantID integer, PlantName varchar(50), PlantCreated TIMESTAMP, PRIMARY KEY (PlantID))";
  db.query(table1, (err, result) => {
    if (err) throw err;
    console.log("table1 is created...");
  });
  let table2 =
    "CREATE TABLE SPW_Floors (FloorID integer, PlantID integer, FloorName varchar(50), FloorCreated TIMESTAMP, PRIMARY KEY (FloorID, PlantID),  FOREIGN KEY (PlantID) REFERENCES SPW_Plants(PlantID))";
  db.query(table2, (err, result) => {
    if (err) throw err;
    console.log("table2 is created...");
  });
  let table3 =
    "CREATE TABLE SPW_Machines (MachineID integer, FloorID integer, PlantID integer, MachineName varchar(50), MachineCreated TIMESTAMP, PRIMARY KEY (MachineID), FOREIGN KEY (PlantID, FloorID) REFERENCES SPW_Floors(PlantID, FloorID))";
  db.query(table3, (err, result) => {
    if (err) throw err;
    console.log("table3 is created...");
  });
  let table4 =
    "CREATE TABLE SPW_Data (DataID integer, MachineID integer, DataName varchar(50), DataCreated TIMESTAMP, PRIMARY KEY (DataID, MachineID),  FOREIGN KEY (MachineID) REFERENCES SPW_Machines(MachineID))";
  db.query(table4, (err, result) => {
    if (err) throw err;
    console.log("table4 is created...");
  });
  let table5 =
    "CREATE TABLE SPW_Shifts (ShiftID integer, ShiftName varchar(50), TimeOfDay varchar(50), ShiftCreated TIMESTAMP, PRIMARY KEY (ShiftID))";
  db.query(table5, (err, result) => {
    if (err) throw err;
    console.log("table5 is created...");
  });
  let table6 =
    "CREATE TABLE SPW_Users (UserID integer, Username varchar(50), Password varchar(50), PermissionLevel integer, UserCreated TIMESTAMP, PRIMARY KEY (UserID))";
  db.query(table6, (err, result) => {
    if (err) throw err;
    console.log("table6 is created...");
  });
  let table7 =
    "CREATE TABLE SPW_UserShifts (UserShiftID integer, UserID integer, ShiftID integer, PRIMARY KEY (UserShiftID, UserID, ShiftID), FOREIGN KEY (ShiftID) REFERENCES SPW_Shifts(ShiftID),  FOREIGN KEY (UserID) REFERENCES SPW_Users(UserID))";
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
// set the view engine to ejs
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("login");
});

//have app listen on specifc port
app.listen("3000", () => {
  console.log("Server is running on Port 3000");
});
