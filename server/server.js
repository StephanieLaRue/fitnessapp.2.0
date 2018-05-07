const express = require('express')
const app = express()
const bodyparser = require('body-parser');
const fs = require('fs');
const path = require('path');
const port = 3000;
const fitness = require('./mongo.js');


app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}))

app.get('/view', async(req, res) => await fitness.view(req, res))
app.post('/form', async(req, res) => await fitness.login(req, res))
app.post('/remove', async(req, res) => await fitness.remove(req, res))

app.listen(port, () => console.log(`Express server listening on port ${port}...`))
