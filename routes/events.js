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

router.param('id', function(req, res, next, id){
	req.streamer_id = id
	next()
})

router.param('event_id', function(req, res, next, event_id){
	req.event_id = event_id
	next()
})

router.param('user_id', function(req, res, next, user_id){
	req.user_id = user_id
	next()
})

router.get('/', function(req, res, next){
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		var queryString = "select test.events.id, test.events.game, test.events.name, test.events.active, test.events.date, test.users.username from test.events join test.users on test.events.streamer_id = test.users.id order by test.events.id desc"
		client.query(queryString, function(err, result){
		done();
		if(err){
			console.log(err)
			return res.status(400).json({error: true, message: err})
		}
		return res.json({events: result.rows})
		})
	})
})

router.post('/start', function(req, res, next){
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		var queryString = "update test.events set active = true where id = $1 returning *"
		client.query(queryString, [req.body.event_id], function(err, result){
		done();
		if(err){
			console.log(err)
			return res.status(400).json({error: true, message: err})
		}
		return res.json({event: result.rows[0]})
		})
	})
})

router.post('/end', function(req, res, next){
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		var queryString = "update test.events set active = false, complete = true where id = $1 returning *"
		client.query(queryString, [req.body.event_id], function(err, result){
		done();
		if(err){
			console.log(err)
			return res.status(400).json({error: true, message: err})
		}
		return res.json({event: result.rows[0]})
		})
	})
})

router.get('/streamer/:id', function(req, res, next){
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		var queryString = "select * from test.events where streamer_id = $1 order by id desc"
		client.query(queryString, [req.streamer_id], function(err, result){
		done();
		if(err){
			console.log(err)
			return res.status(400).json({error: true, message: err})
		}
		return res.json({events: result.rows})
		})
	})
})

router.get('/event/:event_id', function(req, res, next){
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		var queryString = "select test.events.*, test.users.username from test.events join test.users on test.events.streamer_id = test.users.id where test.events.id = $1"
		client.query(queryString, [req.event_id], function(err, result){
		done();
		if(err){
			console.log(err)
			return res.status(400).json({error: true, message: err})
		}
		return res.json({events: result.rows[0]})
		})
	})
})

router.get('/active/:user_id', function(req, res, next){
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		var queryString = "select count(*) from test.events where active = true and streamer_id = $1"
		client.query(queryString, [req.user_id], function(err, result){
		done();
		if(err){
			console.log(err)
			return res.status(400).json({error: true, message: err})
		}
		return res.json({active: result.rows[0]['count']})
		})
	})
})

router.post('/', function(req, res, next){
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		var queryString = "insert into test.events (streamer_id, game, date, active, ante_min, ante_max, name, players) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *"
		client.query(queryString, [req.body.streamer_id, req.body.game, req.body.date, false, req.body.ante_min, req.body.ante_max, req.body.name, req.body.players], function(err, result){
		done();
		if(err){
			console.log(err)
			return res.status(400).json({error: true, message: err})
		}
		return res.json({events: result.rows})
		})
	})
})

router.post('/entry', function(req, res, next){
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		var queryString = "insert into test.entries (event_id, user_id, ante) values ($1, $2, $3) returning *"
		client.query(queryString, [req.body.event_id, req.body.user_id, req.body.ante], function(err, result){
		done();
		if(err){
			console.log(err)
			return res.status(400).json({error: true, message: err})
		}
		return res.json({entry: result.rows[0]})
		})
	})
})

router.get('/entry/:user_id/:event_id', function(req, res, next){
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		var queryString = "select * from test.entries where user_id = $1 and event_id = $2"
		client.query(queryString, [req.user_id, req.event_id], function(err, result){
		done();
		if(err){
			console.log(err)
			return res.status(400).json({error: true, message: err})
		}
		return res.json({entry: result.rows[0]})
		})
	})
})

router.post('/entry/cancel', function(req, res, next){
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		var queryString = "delete from test.entries where user_id = $1 and event_id = $2"
		client.query(queryString, [req.body.user_id, req.body.event_id], function(err, result){
		done();
		if(err){
			console.log(err)
			return res.status(400).json({error: true, message: err})
		}
		return res.json({remove: 'ok'})
		})
	})
})

module.exports = router