const express = require('express')
const app = express()
const bodyparser = require('body-parser');
const fs = require('fs');
const path = require('path');
const port = 3000;
const fitness = require('./mongo.js');
const confirmSignIn = require('./confirmSignIn');
const register = require('./registration');
const creds = require('./userCredentials.json');
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
  console.log('server result', result);
  if(result) {
    sessions.username = result;
    console.log(sessions);
  }
});

// app.get('/profile', function(req, res) {
//   if(sessions && sessions.username) {
//     res.sendFile(path.join(__dirname, '../public', 'index.html'))
//     console.log(sessions.username + "'s" + ' profile was sent...');    
//   }
//   else {
//     res.send('Unauthorized Access: Please Sign In')
//   }
// })

app.post('/register', async(req, res) => await register.registration(req, res));
app.get('/view', async(req, res) => await fitness.view(req, res));
app.post('/form', async(req, res) => await fitness.login(req, res));
app.post('/remove', async(req, res) => await fitness.remove(req, res));

app.listen(port, () => console.log(`Express server listening on port ${port}...`));
