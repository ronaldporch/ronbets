var express = require('express');
var router = express.Router();
var pg = require('pg');
//select game_id, active, remaining_time, players->>'players' as players from test.match

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req,res,next){
	res.json({'name':"Ronald"})
})

module.exports = router;
