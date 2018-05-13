const express = require('express')
const app = express()
const bodyparser = require('body-parser');
const fs = require('fs');
const path = require('path');
const port = 3000;
const fitness = require('./mongo.js');
const creds = require('./userCredentials.json')
const credentials = require("./credentials.json")
const MongoClient = require('mongodb').MongoClient
const register = require('./registration');
const url = `mongodb://${credentials.mongoUser}:${credentials.mongoPass}@127.0.0.1:27017/fitnessapp-two`
const dbName = 'fitnessapp';


let db;
let client;

let connectToDb = async function() {
  try {
    client = await MongoClient.connect(url, {authSource: "admin"})
    console.log('Fitnessapp-signIn: ' + 'connected to mongo server...');
    db = client.db(dbName);
    return db;
  }
  catch (err) {
	console.log("ERR:", err);
    return err;
  }
}();

module.exports = {
	confirmCredentials: async(req, res) => {
		try {
			let userData = {
				user: req.body.username,
				pass: req.body.password
			}

			let result = await matchUser(userData, db)
			if(!result.length || !result) {
				console.log(null);	
				res.send('failure')
				return;			
			}
			if(userData.user === result[0].user && userData.pass === result[0].pass) {
				console.log('Success');
				res.send('successful')
				return result[0].user; 
			}
			else {
				res.send('failure')
			}    
		}
		catch(err) {
			console.log(err.stack);
			return err;
		}
	}    
}

const matchUser = async function(userData, db) {
	try {
		let result = await db.collection('registeredusers').find({user: userData.user, pass: userData.pass}).toArray();
		console.log('matched result', result);
		return result;
	}
	catch(err) {
		console.log(err.stack);
		console.log('Error finding collection...');
		return err;
	}
}
