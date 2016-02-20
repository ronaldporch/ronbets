var express = require('express')
var router = express.Router();
var passport = require('passport');
var auth = require('../functions/user.js')
var pg = require('pg')
var nodemailer = require('nodemailer')
var conString = "postgres://postgres:Blazeteam1@localhost/test"
//var conString = process.env.DATABASE_URL

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'dada5714@gmail.com',
		pass: 'ProjectRose1'
	}
})

router.post('/register', function(req, res, next){
	if(!req.body.username || !req.body.password || !req.body.email){
		return res.status(400).json({message: 'Please fill out all fields'})
	}

	if(req.body.password != req.body.confirmPassword){
		console.log(req.protocol)
		console.log(req.get('host'))
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
		client.query('insert into test.users (username, email, hash, salt, user_active) VALUES ($1::varchar, $2::varchar, $3::varchar, $4::varchar, false) returning *', user, function(err, result){
				done();
				if(err){
					console.log(err)
					return res.status(400).json({error: true, message: err})
				}
				var user = result.rows[0]
				var mailOptions = {
					from: 'Casino Night <dada5714@gmail.com>',
					to: user.email,
					subject: 'Registered for Casino Night',
					text: 'Hello, ' + user.username + '. You registered for Casino Nights. Please go to ' + req.protocol + '://' + req.get('host') + '/#/activate/' + user.id + ' to activate your account.',
					html: '<h2>Hello ' + user.username + '.</h2> <p>You registered for Casino Night. Follow <a href="' + req.protocol + '://' + req.get('host') + '/#/activate/' + user.id + '">this link</a> to confirm your account</p><br><small>Link isn\'t working? ' + req.protocol + '://' + req.get('host') + '/#/activate/' + user.id + '</small>'
				}
				transporter.sendMail(mailOptions, function(err, info){
					if(err){
						return console.log(err)
					}
					console.log('Message Sent: ' + info.response)
					return res.json({success: true})
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
		client.query('select username, id from test.users where id = $1::int and user_active = false', [req.user_id], function(err, results){
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
router.post('/sign_in', function(req, res, next){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message: 'Please fill out all fields'})
	}

	passport.authenticate('local', function(err, user, info){
		if(err){return next(err)}

			if(user){
				if(user.user_active){
					console.log(user)
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
					var queryString = "update test.users set user_active = true, wallet = 1000";
					var queryData = []
					queryData.push(user.id)
					if(req.body.streamService != 'none'){
						queryString += ', stream_service = $2, chat_service = $3, stream_name = $4'
						queryData.push(req.body.streamService)
						queryData.push(req.body.chatService)
						queryData.push(req.body.streamName)
						if(req.body.chatService == 'chatango'){
							queryString += ", chatango = $4"
							queryData.push(req.body.chatango)
						}
					}
					queryString += ' where id = $1::int'
					console.log(queryString)
					console.log(queryData)
					client.query(queryString, queryData, function(err, results){
						done();
						if(err){
							console.log(err)
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