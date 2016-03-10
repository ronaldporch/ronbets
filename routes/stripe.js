var express = require('express');
var router = express.Router();
var pg = require('pg');
var passport = require('passport');
var auth = require('../functions/user.js')
var conString = "postgres://postgres:Blazeteam1@localhost/test"
var stripe = require('stripe')('sk_test_QQU5TlOJRvvEv9bazOnJvcB0')
//var conString = process.env.DATABASE_URL

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
		//res.json(charge)
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
			var queryString = "update test.users set wallet = wallet + $1 where id = $2"
			client.query(queryString, [creditAmount, req.body.user_id], function(err, results){
				done();
				if(err){
					return console.error("error", err);
				}
				res.json({success: true});
			});
		})
	})
})

module.exports = router;
