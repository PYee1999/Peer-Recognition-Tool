
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const URI = "mongodb+srv://devapp:wintermute3000@cluster0.val9t.mongodb.net/TestDatabase"
  + "?retryWrites=true&w=majority";

var companyID = -1;



// Authentication Setup
const session = require("express-session")
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
<<<<<<< HEAD
const { default: UserPostLayOut } = require('../prt-frontend/src/components/Medium/UserPostLayOut')

=======
const { response } = require('express')
>>>>>>> b528e255860b7813c3695c4d7d000197924d7717
const SESSION_LENGTH = 1_800_000;  // = 30 minutes in ms

// Calling passport.use tells Passport to run this code to match a username and
// password to a user.
//    See http://www.passportjs.org/docs/configure/
passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    // TODO: When connected with database, actually look up a user.
    if (username === 'username' && password === 'password') {
      // We would want to return a user from the database here
      const dummyUserObject = { userId: 0 };
      return done(null, dummyUserObject);
    }

    // Returning done with false indicates that the credentials were incorrect
    return done(null, false, {
      message: 'WIP, use username = "username" and password = "password"'
    });
  }
));

passport.serializeUser(function(user, done) {
  // TODO: Use database and return user ID
  done(null, user.id);
});

<<<<<<< HEAD
passport.deserializeUser(function(id, done) {
  // TODO: Use database and lookup by given user ID
  
  done(null, id);
=======
passport.deserializeUser(function(userid, done) {
  User.findById(userid, function(err, user) {
    done(err, user);
  });
>>>>>>> b528e255860b7813c3695c4d7d000197924d7717
});

//get request to '/employee' using res.send inside
var recognitions = {
  recognizer: null,
  recognizee: null,
  core: null,
  message: null,
}

app.use(cors());
app.use(bodyParser.json());
app.post("/login", (req, res) => {
    console.log(req.body)
    login(req, res);
});

async function login(req, res) {
  const MongoClient = require('mongodb').MongoClient;
  const client = new MongoClient(URI);
  try {
      await client.connect();
      var dbo = client.db("Test-Database");
      console.log(req.body.username);
      console.log(req.body);
      dbo.collection("TestEmployees").findOne({email: req.body.username}, function(err, result) {
        if (result == null){ 
          res.send({"suc":false}); 
        }
        else if (req.body.username === result.email && req.body.password === result.password) {
          // We would want to return a user from the database here
          companyID = result.companyId;
          console.log(companyID);
          res.send({"suc":true, "val": result}); 
        }
        else{
          res.send({"suc":false}); 
        }
      });
    }
  finally {
    await client.close();
  }
}

app.use(cors());
app.use(bodyParser.json());
app.get("/recogs", (req, res) => {
  getRecogs(req, res);
});

<<<<<<< HEAD
app.post('/logout', (req, res) => {
  req.logout();
  // res.redirect('/');
});
=======
async function getRecogs(req, res) {
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(URI);
var allRecogs;
try {
    await client.connect();
    var dbo = client.db("Test-Database");
    console.log(companyID);
    dbo.collection("TestRecognitions").find({companyID: companyID}, function(err, result) {
      allRecogs = result;
    });
    var count = 0;
    recogsIndexed = {};
    await allRecogs.forEach(doc => indexRecogs(doc));
    function indexRecogs(doc){
      recogsIndexed[count] = doc;
      count++;
    }
    res.send(recogsIndexed);
  }
finally {
  await client.close();
}
}



>>>>>>> b528e255860b7813c3695c4d7d000197924d7717

// The call to app.listen(PORT, ...) is in server.js
module.exports = app
