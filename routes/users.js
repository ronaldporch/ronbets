var express = require('express');
var router = express.Router();
var pg = require('pg');
var conString = "postgres://postgres:Blazeteam1@localhost/test"

/* GET users listing. */
router.get('/', function(req, res, next) {
	pg.connect(conString, function(err, client, done){
		if(err){
			return console.error('error', err);
		}
		client.query("select * from test.users", function(err, results){
			done();
			if(err){
				return console.error("error", err);
			}
			console.log(results.rows)
			res.json(results.rows);
		});
	})
});

module.exports = router;
