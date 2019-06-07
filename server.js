// Dependencies
// =============================================================
var express = require("express");
// var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");
// var MomentRange = require('moment-range');
// var shiftsUnsorted = require("./models/shiftsUnsorted");
var shifts = require("./models/shifts");
// Connect to database
// =============================================================
// mongoose.connect("mongod://localhost/shifts-test");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Shifts and workers (DATA)
// =============================================================
var validateStartShifts = false;
var validateEndShifts = false;
var test = true;


// const shifts = shiftsUnsorted.sort((a, b) => (a.startShift > b.startShift ? 1 : -1));

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/create.html"));
});

app.get("/all", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/all.html"));
});

// Displays all shifts
app.get("/api/shifts", function(req, res) {
  return res.json(shifts);
});



// // Checks existing shifts
app.get("/api/validate-start/", function(req, res) {
  // validateStartShifts = false;
  var startN = req.body;
  for (var i=0; i<shifts.length; i++) {
    var d2 = shifts[i].endShift;
    if (d2 > startN) {
      return res.json(startN);
    } else {
      return res.json(false);
    }
  }
}); 

// // Checks existing shifts
app.get("/api/validate-end/", function(req, res) {
  validateEndShifts = false;
  var endN = req.body;
  for (var i=0; i<shifts.length; i++) {
    var d1 = shifts[i].startShift;
    if (d1 < endN) {
      res.json(endN);
      // return res.json(shifts)
    } else {
      return res.json(false);
    }
  }
}); 

// d1 >== valid.endN || d2 ==< valid.startN

// Create New Shifts - takes in JSON input
app.post("/api/new-shift", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body-parser middleware
  var Shift = function(id, firstName, lastName, startShift, endShift) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.startShift = startShift;
    this.endShift = endShift;
  }
  
  var newShift = new Shift(
    req.body.id, 
    req.body.firstName, 
    req.body.lastName, 
    req.body.startShift, 
    req.body.endShift
  );

  for (i=0; i<shifts.length; i++) {
    var shiftConflicts = [];
    if (shifts[i].endShift > newShift.startShift && shifts[i].startShift < newShift.endShift) {
      shiftConflicts.push([i]);
    }
  }

  



  // if (validateEndShifts && validateStartShifts) {

    console.log(newShift);

    shifts.push(newShift);

    return res.json(newShift);
    // alert("shift created successfully");
  // } else {
    // return res.json(false);
  // }
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});