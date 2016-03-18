var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var pg = require('pg')
var conString = process.env.DATABASE_URL
var auth = require("../functions/user.js")

passport.use(new LocalStrategy(function(username, password, done){
	pg.connect(conString, function(err, client, pgDone){
		if(err){
			return console.err('error: ', err)
		}
		var queryString = "select * from test.users where username = $1"
		client.query(queryString, [username], function(err, result){
			pgDone();
			var user = result.rows[0]
			if(!user){
				return done(null, false, {message: "Incorrect username"})
			}
			if(!auth.validPassword(user, password)){
				return done(null, false, {message: "Incorrect Password"})
			}

			return done(null, user)
		})
	})
}))