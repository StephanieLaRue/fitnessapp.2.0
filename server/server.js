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

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyparser.json());
app.use(session({secret: 'userlogin'}))
app.use(bodyparser.urlencoded({
  extended: true
}));


app.post('/signin', async(req, res) => {
  sessions = req.session;
  let result = await confirmSignIn.confirmCredentials(req, res)
  if(result.name) {
    sessions.username = result.name;
    sessions.profile = result.userProfile
    console.log('session user: ', sessions);
  }
  res.send(result.status);
});

app.get('/profile', function(req, res) {
  if(sessions && sessions.username) {
    res.sendFile(path.join(__dirname, '../public', 'profile.html'))   
  }
  else {
    res.send('Unauthorized Access: Please Sign In')
  }
})

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
