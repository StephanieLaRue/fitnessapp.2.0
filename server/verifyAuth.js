const jsonToken = require('jsonwebtoken');
const crypto = require('crypto')
const config = require('./config.js')
const hash = crypto.createHmac('sha256', config.secret)
.update('I love cupcakes')
.digest('hex');

module.exports = {
    authorizeToken: async(req, res) => {
        try {
            let token = req.headers['x-access-token'];
            if (!token)
            return res.status(403).send({ auth: false, message: 'No token provided.' });
            let result = await check(token)
            console.log('check', result);
            return result
        }
        catch(err) {
            console.log(err.stack);
			return err;
        }
    }
}

const check = async function(token) {
try {
    let result = await jsonToken.verify(token, hash, function(err, decoded) {
        if (err)
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        // if (id == decoded.id) {
        // return true
        // }

        })
        return true
    }
    catch(err) {
        console.log(err.stack);
        return err;
    }
}
    
 