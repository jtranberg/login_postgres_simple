const express = require("express");
const { Pool, Client } = require("pg");
const bodyParser = require("body-parser");

const app = express();

// const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, '…/.env') });

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

app.use("/assets", express.static("assets"));

const client = new Client({
  port: 5432,
  host: "localhost",
  database: "postgres",
  user: "postgres",
  password: "1234",
});

database = client.database;

client.connect(function (error) {
  if (error) throw error;
  else console.log(`You are connected to ${database}`);
});

// Default route
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// POST route for login
app.post("/", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  client.query(
    "SELECT * FROM users WHERE user_name = $1 AND user_pass = $2",
    [username, password],
    function (error, results, fields) {
      if (error) {
        console.error("Error occurred during login:", error);
        res.status(500).send("An error occurred while logging in.");
      } else {
        if (results.rowCount > 0) {
          res.redirect("/welcome");
        } else {
          res.redirect("/register");
        }
      }
      res.end();
    }
  );
});

// GET route for register page
app.get("/register", function (req, res) {
  res.sendFile(__dirname + "/register.html");
});

// POST route for register
app.post("/register", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  client.query(
    "INSERT INTO users (user_name, user_pass) VALUES ($1, $2)",
    [username, password],
    function (error, results) {
      if (error) {
        console.error("Error occurred during registration:", error);
        res.status(500).send("An error occurred while registering.");
      } else {
        if (results.rowCount > 0) {
          res.redirect("/"); // Redirect upon successful registration
        } else {
          res.redirect("/"); // Redirect if no rows were affected
        }
      }
    }
  );
});
// Route for welcome page
app.get("/welcome", function (req, res) {
  res.sendFile(__dirname + "/welcome.html");
});

// app.get("/logout", function (req, res) {
//     res.destroy()
//     res.end();
//     res.redirect("/");    // Redirect if no rows were affected
// });

app.listen(3001);
