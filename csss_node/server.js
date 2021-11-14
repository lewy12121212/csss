require('dotenv').config();

var fs = require('fs');
//var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('httpsCert/key.pem', 'utf8');
var certificate = fs.readFileSync('httpsCert/cert.pem', 'utf8');
//var credentials = {key: privateKey, cert: certificate};

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const employeeUtils = require('./employeeUtils');
const clientUtils = require('./clientUtils');

const app = express();
const port = process.env.PORT || 4000;
const server = https.createServer({key: privateKey, cert: certificate }, app);

const mysql = require("mysql");

const db = mysql.createPool({
  host: 'dysk.sytes.net',
  user: 'csss_admin',
  password: 'csss.2000.!@',
  port: '8888',
  database: 'DB_csss'
});
exports.db = db;

// enable CORS
app.use(cors());

//payload size
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

//extention files
require('./employeeLogin')(app, db, employeeUtils);
require('./clientLogin')(app, db, clientUtils);

//panels endpoints
require('./PanelsEndPoints/adminPanel')(app, db, clientUtils);
require('./PanelsEndPoints/commonPanel')(app, db, clientUtils);



app.use((req, res, next) => {
  var token = req.headers['authorization'];
  if (!token) return next(); //if no token, continue

  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      next();
    }
  });
});

app.get('/', (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Invalid user to access it.' });
  res.send('Welcome to the Node.js' + req.user.name);
});

app.get('/dbTest', (req, res) => { 
  const sqlShowTables = "SHOW TABLES"
  db.query(sqlShowTables, (err, result) => {
      console.log(result)
      res.send(result)
  })
});

app.get('/dbConnect', (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Invalid user to access it.' });
  res.send('Welcome to the Node.js - database connect' + req.user.name);
});

app.get('/verifyToken', (req, res) => {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token;
  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token is required."
    });
  }
  // check token that was passed by decoding token using secret
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({
      error: true,
      message: "Invalid token."
    });

    if(user.Type === undefined){
      const sqlQuery = "SELECT * FROM DB_clients WHERE Id like (?)"

      db.query(sqlQuery, [user.Id], (err, result) => {
        if (err) return res.status(401).json({
          error: true,
          message: "Invalid database connection."
        });
        // return 401 status if the userId does not match.
        if (user.Id !== result[0].Id) {
          return res.status(401).json({
            error: true,
            message: "Invalid user."
          });
        }
        // get basic user details
        var userObj = clientUtils.getCleanUser(result[0]);
        return res.json({ user: userObj, token });
      })

    } else {
      const sqlQuery = "SELECT * FROM DB_employees WHERE Id like (?)"

      db.query(sqlQuery, [user.Id], (err, result) => {
        if (err) return res.status(401).json({
          error: true,
          message: "Invalid database connection."
        });
        // return 401 status if the userId does not match.
        if (user.Id !== result[0].Id) {
          return res.status(401).json({
            error: true,
            message: "Invalid user."
          });
        }
        // get basic user details
        var userObj = employeeUtils.getCleanUser(result[0]);
        return res.json({ user: userObj, token });
      })
    }
    //console.log("verify token user: ", user.Type, user.Login, user.Pass, user.Id)

    
  });
});

server.listen(port, () => {
  console.log('Server started on: ' + port);
});

