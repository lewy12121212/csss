require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const utils = require('./utils');

const app = express();
const port = process.env.PORT || 4000;

const mysql = require("mysql");

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'DB_csss'
});

//const db = mysql.createPool({
//  host: '192.168.1.16',
//  user: 'csss-admin',
//  password: 'csss.admin.2000',
//  database: 'DB_csss'
//});

app.get('/dbConnect', (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Invalid user to access it.' });
  res.send('Welcome to the Node.js Tutorial! - ' + req.user.name);
});

// enable CORS
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

//mysql tester connection
app.get('/dbTest', (req, res) => { 
  const sqlShowTables = "SHOW TABLES"
  db.query(sqlShowTables, (err, result) => {
      console.log(result)
      res.send(result)
  })
});
//mysql tester connection end

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

// request handlers
app.get('/', (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Invalid user to access it.' });
  res.send('Welcome to the Node.js Tutorial! - ' + req.user.name);
});

// validate the user credentials
app.post('/users/signin', (req, res) => {
  const user = req.body.username;
  const pwd = req.body.password;

  if (!user || !pwd) { //if empty
    return res.status(400).json({
      error: true,
      message: "Username or Password required."
    });
  }

  const sqlQuery = "SELECT * FROM DB_users WHERE Login like (?) AND Pass like (?)"
    
  db.query(sqlQuery, [user, pwd], (err, result) => {
    if(result.length > 1){
      return res.status(401).json({
        error: true,
        message: "Many users with the same login."
      });
    } else if(result.length == 0){
      return res.status(401).json({
        error: true,
        message: "No user with this data."
      });
    } else {
      let userData = result[0]
      const token = utils.generateToken(userData);
      const userObj = utils.getCleanUser(userData);
      return res.status(200).json({ user: userObj, token }); 
    }
  })
});

// verify the token and return it if it's valid
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

    const sqlQuery = "SELECT * FROM DB_users WHERE Id like (?)"
    
    db.query(sqlQuery, [user.Id], (err, result) => {
      // return 401 status if the userId does not match.
      if (user.Id !== result[0].Id) {
        return res.status(401).json({
          error: true,
          message: "Invalid user."
        });
      }
      // get basic user details
      var userObj = utils.getCleanUser(result[0]);
      return res.json({ user: userObj, token });
    })
  });
});

app.listen(port, () => {
  console.log('Server started on: ' + port);
});