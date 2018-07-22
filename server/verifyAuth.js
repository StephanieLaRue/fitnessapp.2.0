const jsonToken = require('jsonwebtoken');
const crypto = require('crypto')
const config = require('./config.js')
const hash = crypto.createHmac('sha256', config.secret)
.update('I love cupcakes')
.digest('hex');



const credentials = require("./credentials.json")
const MongoClient = require('mongodb').MongoClient;
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
    authorizeToken: async(req, res) => {
        try {
            let token = req.headers['x-access-token'];
            let user = req.body.user;
            if (!user) 
            return res.status(404).send("No user found.");
            if (!token)
            return res.status(403).send({ auth: false, message: 'No token provided.' });

            let findUser = await matchUser(user, db)
            let result = await checkToken(token)
            if(result == findUser[0]._id) {
                return true
            }
            else {return false}
            
        }
        catch(err) {
            console.log(err.stack);
			return err;
        }
    }
}

const matchUser = async function(userData, db) {
	try {
		let result = await db.collection('registeredusers').find({user: userData}).toArray();
		return result;
	}
	catch(err) {
		console.log(err.stack);
		console.log('Error finding collection...');
		return err;
	}
}


const checkToken = async function(token) {
try {
    let decode;
    await jsonToken.verify(token, hash, function(err, decoded) {
        if (err)
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        decode = decoded.id;
    })
    return decode;
    }
    catch(err) {
        console.log(err.stack);
        return err;
    }
}
    
 