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


app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}));

app.post('/signin', function(req, res) {
  confirmSignIn.confirmCredentials(req,res)
});

app.post('/register', async(req, res) => await register.registration(req, res));

app.get('/view', async(req, res) => await fitness.view(req, res));
app.post('/form', async(req, res) => await fitness.login(req, res));
app.post('/remove', async(req, res) => await fitness.remove(req, res));

app.listen(port, () => console.log(`Express server listening on port ${port}...`));
