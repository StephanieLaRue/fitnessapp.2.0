const express = require('express')
const app = express()
const bodyparser = require('body-parser');
const fs = require('fs');
const path = require('path');
const port = 3000;
const fitness = require('./mongo.js');
const MongoClient = require('mongodb').MongoClient;
const credentials = require("./credentials.json")
const url = `mongodb://${credentials.mongoUser}:${credentials.mongoPass}@127.0.0.1:27017/fitnessapp-two`
const dbName = 'fitnessapp';


let db;
let client;

let connectToDb = async function() {
  try {
    client = await MongoClient.connect(url, {authSource: "admin"})
    console.log('Fitnessapp-registration: ' + 'connected to mongo server...');
    db = client.db(dbName);
    return db;
  }
  catch (err) {
		console.log("ERR:", err);
    return err;
  }
}();

module.exports = {
	registration: async function(req, res) {
		try {
			let body = req.body;
      await insertDocs(body, db);
      return {status: 'registered'}
		}
		catch(err) {
			console.log("ERR:", err);
			return err;
		}  
	} 
}


const insertDocs = async function(body, db) {
  try {
		let newUser = {
			user: body.newUsername,
      pass: body.newPassword,
      profile: body.userProfile
		}
    let result = await db.collection('registeredusers').insert(newUser)
    console.log('DATA INSERTED: ', result);
    return result;
  }
  catch(err) {
    console.log(err.stack);
    console.log('Error inserting collection...');
    return err;
  }
}
