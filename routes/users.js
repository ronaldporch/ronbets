var express = require('express');
var router = express.Router();
var pg = require('pg');
var passport = require('passport');
var auth = require('../functions/user.js')
var conString = process.env.DATABASE_URL

/* GET users listing. */
router.param('id', function(req, res, next, id){
	req.user_id = id
	next();
})
router.get('/:id', function(req, res, next) {
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error', err);
		}
		client.query("select * from test.users where id = $1", [req.user_id], function(err, results){
			done();
			if(err){
				return console.error("error", err);
			}
			console.log(results.rows)
			res.json(results.rows[0]);
		});
	})
});
router.post('/:id', function(req, res, next) {
	console.log(req.body)
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error', err);
		}
		var queryString = "update test.users set email = $1, stream_service = $2, challonge_key = $3"
		var queryData = []
		queryData.push(req.body.email, req.body.stream_service, req.body.challonge_key, req.body.id)
		if(req.body.stream_service != 'none'){
			queryString += ", stream_name = $5, chat_service = $6"
			queryData.push(req.body.stream_name, req.body.chat_service)
		}
		if(req.body.chat_service == 'chatango'){
			queryString += ", chatango = $7"
			queryData.push(req.body.chatango)
		}
		queryString += " where id = $4 returning *"
		client.query(queryString, queryData, function(err, results){
			done();
			if(err){
				return console.error("error", err);
			}
			console.log(results.rows)
			res.json({token: auth.generateJWT(results.rows[0])});
		});
	})
});

module.exports = router;
