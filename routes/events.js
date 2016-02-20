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

router.get('/', function(req, res, next){
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error fetching client from pool', err);
		}
		var queryString = "select * from test.events order by id desc"
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
		var queryString = "select * from test.events where id = $1"
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

module.exports = router