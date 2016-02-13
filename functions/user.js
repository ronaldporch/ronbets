var crypto = require('crypto')
var jwt = require('jsonwebtoken')

var auth = {}

auth.setPassword = function(password){
	var salt = crypto.randomBytes(16).toString('hex');
	var hash = crypto.pbkdf2Sync(password, salt, 1000, 64).toString('hex')
	return {salt: salt, hash: hash}
}

auth.validPassword = function(user, password){
	var hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64).toString('hex')
	return user.hash === hash;
}

auth.generateJWT = function(user){
	var today = new Date()
	var exp = new Date(today)
	exp.setDate(today.getDate() + 60)

	return jwt.sign({
		_id: user.id,
		username: user.username,
		exp: parseInt(exp.getTime() / 1000)
	}, new Buffer('SECRET', 'base64'))
}

module.exports = auth