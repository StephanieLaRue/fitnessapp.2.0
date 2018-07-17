const express = require('express')
const app = express()
const bodyparser = require('body-parser');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const credentials = require("./credentials.json")
const url = `mongodb://${credentials.mongoUser}:${credentials.mongoPass}@127.0.0.1:27017/fitnessapp-two`
const dbName = 'fitnessapp';
const jsonToken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const config = require('./config.js')

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

      let checkUserList = await findUsers(body, db)
      if(checkUserList === 'true') {
        return {status: 'userexists'}
      }

      let result = await insertDocs(body, db);
      
      return {status: 'registered', token: result.token}
		}
		catch(err) {
			console.log("ERR:", err);
			return err;
		}  
	} 
}


const insertDocs = async function(body, db) {
  try {

    const hash = crypto.createHmac('sha256', config.secret)
      .update('I love cupcakes')
      .digest('hex');

    let hashedPassword = bcrypt.hashSync(body.newPassword, 8);
		let newUser = {
			user: body.newUsername,
      pass: hashedPassword,
      profile: []
    }

    let result = await db.collection('registeredusers').insert(newUser)
    console.log('DATA INSERTED')

    // console.log("id:", result.ops[0]._id)
    let token = jsonToken.sign({ id: result.ops[0]._id}, hash, {expiresIn: 86400});
    // console.log('token', token);
    // create authentication/verification function to verify username and token match a specific user
    // return token and username to client upon registration & login
    // on the client side: send the token and username up for every client request
    // make sure not to return password to client/not stored on client side

    // Use decode to verify username and pass
    var decode = jsonToken.decode(token);
    // console.log('decode', decode);
    
    return {result, token};
  }
  catch(err) {
    console.log(err.stack);
    console.log('Error inserting collection...');
    return err;
  }
}


const findUsers = async function(data, db) {
	try {
    let result = await db.collection('registeredusers').find({}).toArray()
    let match;
    result.forEach((ele) => {
      if(data.newUsername === ele.user) {
        match = 'true';  
      }
    })
		console.log('matchedUser result:', match);
		return match;
	}
	catch(err) {
		console.log(err.stack);
		console.log('Error finding collection...');
		return err;
	}
}