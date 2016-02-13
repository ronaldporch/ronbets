var express = require('express')
var router = express.Router();
var passport = require('passport');
var auth = require('../functions/user.js')
var pg = require('pg')
var conString = "postgres://postgres:Blazeteam1@localhost/test"

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'dada5714@gmail.com',
		pass: 'blazeteam2'
	}
})

router.post('/register', function(req, res, next){
	if(!req.body.username || !req.body.password || !req.body.email){
		return res.status(400).json({message: 'Please fill out all fields'})
	}

	if(!(req.body.password != req.body.confirmPassword)){
		return res.status(400).json({message: 'Passwords don\'t match'})
	}

	var password = auth.setPassword(req.body.password)
	var user = [
	req.body.username,
	req.body.email,
	password.hash,
	password.salt
	];

	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query('insert into test.users (username, email, fname, lname, hash, salt) VALUES ($1::varchar, $2::varchar, $3::varchar, $4::varchar, $5::varchar, $6::varchar)', user, function(err, result){
				done();
				if(err){
					return res.status(400).json({error: true, message: err})
				}
				client.query('select * from users where username = $1::varchar', [req.body.username], function(err, results){
					done();
					if(err){
						return res.status(400).json({error: true, message: err})
					}
					var user = results.rows[0]
					var mailOptions = {
						from: 'Ronald Porch <dada5714@gmail.com>',
						to: user.email,
						subject: 'Registered for Casino Night',
						text: 'Hello, ' + user.username + '. You registered for Casino Nights. Please go to localhost:3000/#/activate/' + user.id + ' to activate your account.',
						html: '<h2>Hello ' + user.username + '.</h2> <p>You registered for Casino Night. Follow <a href="localhost:3000/#/activate/' + user.id + '">this link</a> to confirm your account</p><br><small>Link isn\'t working? localhost:3000/#/activate/' + user.id + '</small>'
					}
					transporter.sendMail(mailOptions, function(err, info){
						if(err){
							return console.log(err)
						}
						console.log('Message Sent: ' + info.response)
						return res.json({success: true})
					})
					//return res.json({token: auth.generateJWT(user)})
				})
			})
		})
})

router.param('id', function(req, res, next, id){
	req.user_id = id
	next();
})

router.get('/getUser/:id', function(req, res, next){
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		client.query('select username, id from users where id = $1::int and user_active = false', [req.user_id], function(err, results){
			done();
			if(err){
				return res.status(400).json({error: true, message: err})
			}
			var user = results.rows[0]
			if(!user){
				return res.status(400).json({error: true, redirect: true, message: "This user does not need activation"})
			}
			res.json(user)
		})
	})
})
router.post('/login', function(req, res, next){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Please fill out all fields'})
	}

	passport.authenticate('local', function(err, user, info){
		if(err){return next(err)}

			if(user){
				if(user.user_active){
					return res.json({token: auth.generateJWT(user)})
				}else{
					return res.status(400).json({error: true, message: 'User has not yet been activated. Please check email for activation.'})
				}
				
			}else{
				return res.status(401).json(info);
			}
	})(req, res, next);
})
router.post('/activate', function(req, res, next){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Please fill out all fields'})
	}

	passport.authenticate('local', function(err, user, info){
		if(err){return next(err)}

			if(user){
				pg.connect(conString, function(err, client, done){
					if(err){
						return console.error('error fetching client from pool', err);
					}
					client.query('update users set user_active = true where id = $1::int', [user.id], function(err, results){
						done();
						if(err){
							return res.status(400).json({error: true, message: err})
						}
						return res.json({token: auth.generateJWT(user)})
					})
				})
			}else{
				return res.status(401).json(info);
			}
	})(req, res, next);
})

module.exports = router