const credentials = require("./credentials.json")
const MongoClient = require('mongodb').MongoClient;
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
			// var token = req.headers['x-access-token'];
	
			// jsonToken.verify(token, config.secret, function(err, decoded) {
			//   console.log(decoded);
			  
			// });


			const hash = crypto.createHmac('sha256', config.secret)
      .update('I love cupcakes')
			.digest('hex');
			

			let userData = {
				user: req.body.username,
				pass: req.body.password,
			}

			let result = await matchUser(userData, db)
			let passwordIsValid = bcrypt.compareSync(userData.pass, result[0].pass);
			console.log(passwordIsValid);
			
			
			if(!result.length || !result) {
				console.log('Username is:' + null);	
				return {status: 'invalidEntry'}		
			}
			if(userData.user === result[0].user && passwordIsValid) {
				console.log('USERNAME MATCHED');
				var token = jsonToken.sign({ id: result[0]._id}, hash, {
					expiresIn: 86400 
				});		  
				return {name: result[0].user, status: 'successful', userProfile: result[0].profile, token: token}; 
			}
			if(userData.user === result[0].user && !passwordIsValid) {
				console.log('Invalid Entry');			
				return {status: 'invalidEntry'}
			}
			else {
				return {status: 'invalidEntry'}	
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
		let result = await db.collection('registeredusers').find({user: userData.user}).toArray();
		console.log('matchUser result:', result);
		return result;
	}
	catch(err) {
		console.log(err.stack);
		console.log('Error finding collection...');
		return err;
	}
}
