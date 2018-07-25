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
const auth = require('./verifyAuth.js')
let sessions;

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyparser.json());
app.use(session({secret: 'userlogin'}))
app.use(bodyparser.urlencoded({
  extended: true
}));


app.post('/api/fitness/signin', async(req, res) => {
  sessions = req.session;
  let result = await confirmSignIn.confirmCredentials(req, res)
  if(result.name) {
    sessions.username = result.name;
    sessions.profile = result.userProfile
    id = result.id
  }
  if(result.status == 'successful') {
    res.send({name: result.name, token: result.token, status: false});
  }
  if(result.status == 'invalidEntry') {
    res.send({status: true})
  }
  
});

app.get('/api/fitness/profile', function(req, res) {
  if(sessions && sessions.username) {
    res.sendFile(path.join(__dirname, '../public', 'profile.html'))   
  }
  else {
    res.send('Unauthorized Access: Please Sign In')
  }
})

// curl -X 'POST' -d 'newUsername=abc123&newPassword=abc123' 'localhost:3000/register'
app.post('/api/fitness/register', async(req, res) => {
  let result = await register.registration(req, res)
  result = result.status;
  res.send(result);
});


app.get('/api/fitness/view', async(req, res) => {
  let verifyToken = await auth.authorizeToken(req, res);
  if(!verifyToken){
    return res.status(403).send({ auth: false, message: 'Token Invalid.' });
  }
  req.body = sessions.username;
  fitness.view(req, res)
})


app.post('/api/fitness/update', async(req, res) => {
  let verifyToken = await auth.authorizeToken(req, res);
  if(!verifyToken){
    return res.status(403).send({ auth: false, message: 'Token Invalid.' });
  }
  let result = await fitness.update(req, res) 
  res.send(result)
});

app.post('/api/fitness/remove', async(req, res) => {
  let verifyToken = await auth.authorizeToken(req, res);
  if(!verifyToken){
    return res.status(403).send({ auth: false, message: 'Token Invalid.' });
  }
  let result = await fitness.remove(req, res); 
  res.send(result)
});

app.listen(port, () => console.log(`Express server listening on port ${port}...`));
