var express = require('express');
var router = express.Router();
var pg = require('pg');
var passport = require('passport');
var auth = require('../functions/user.js')
var stripe = require('stripe')(process.env.STRIPE_API)
var conString = process.env.DATABASE_URL

/* GET users listing. */
router.param('id', function(req, res, next, id){
	req.user_id = id
	next();
})
router.post('/credits', function(req, res, next){
	stripe.charges.create(req.body.charge, function(err, charge){
		if(err){
			res.json(err)
		}
		var creditAmount;
		switch(charge.amount){
			case 500:
				creditAmount = 100;
				break;
			case 1000:
				creditAmount = 220;
				break;
			case 1500:
				creditAmount = 350;
				break;
			case 2000:
				creditAmount = 500;
				break;
		}
		pg.connect(conString, function(err, client, done){
			if(err){
				return console.error('error', err);
			}
			var queryString = "update test.entries set ante = ante + $1, recharged = true where user_id = $2 and event_id = $3"
			client.query(queryString, [creditAmount, req.body.user_id, req.body.event_id], function(err, results){
				done();
				if(err){
					return console.error("error", err);
				}
				var queryString = "insert into test.recharges (streamer_id, amount) values ($1, $2)"
				client.query(queryString, [req.body.streamer_id, (charge.amount / 200)], function(err, result){
					done();
					if(err){
						return console.error("error: ", err)
					}
					res.json({success: true});
				})
			});
		})
	})
})

module.exports = router;
