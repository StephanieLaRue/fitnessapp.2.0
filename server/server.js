const express = require('express')
const app = express()
const bodyparser = require('body-parser');
const fs = require('fs');
const path = require('path');
const port = 3000;
const fitness = require('./mongo.js');
const confirmSignIn = require('./confirmSignIn');
const register = require('./registration');
const session = require('express-session')
let sessions;

const jsonToken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const config = require('./config.js')
const hash = crypto.createHmac('sha256', config.secret)
.update('I love cupcakes')
.digest('hex');

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyparser.json());
app.use(session({secret: 'userlogin'}))
app.use(bodyparser.urlencoded({
  extended: true
}));

let id = ''

app.get('/authVerify', function(req, res) {
  let token = req.headers['x-access-token'];
  if (!token)
  return res.status(403).send({ auth: false, message: 'No token provided.' });

  jsonToken.verify(token, hash, function(err, decoded) {
    if (err)
    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    if (id == decoded.id) {
      res.send('Success')
    }
  })
})


app.post('/signin', async(req, res) => {
  sessions = req.session;
  let result = await confirmSignIn.confirmCredentials(req, res)
  if(result.name) {
    sessions.username = result.name;
    sessions.profile = result.userProfile
    id = result.id
  }
  res.send({status: result.status, token: result.token});
});

app.get('/profile', function(req, res) {
  if(sessions && sessions.username) {
    res.sendFile(path.join(__dirname, '../public', 'profile.html'))   
  }
  else {
    res.send('Unauthorized Access: Please Sign In')
  }
})

// curl -X 'POST' -d 'newUsername=abc123&newPassword=abc123' 'localhost:3000/register'
app.post('/register', async(req, res) => {
  let result = await register.registration(req, res)
  console.log(result.status);
  result = result.status;
  res.send(result);
});


app.get('/view', function(req, res) {
  let body = sessions.username;
  req.body = body;
  fitness.view(req, res)
})


app.post('/update', async(req, res) => {
  let result = await fitness.update(req, res)  
  res.send(result)
});

app.post('/remove', async(req, res) => {
  let result = await fitness.remove(req, res); 
  res.send(result)
});

app.listen(port, () => console.log(`Express server listening on port ${port}...`));
