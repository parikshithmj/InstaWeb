var express = require('express');
var router = express.Router();
//for mongodb
var mongojs = require('mongojs');

//mlab uri
var uri = 'mongodb://admin:admin@ds161551.mlab.com:61551/joydb';

var coll = ['instaPosts'];
//connect to mlab 
var db = mongojs( uri, coll);


/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('home', { title: 'Joy' });
});


//GET user page
router.get('/api/listPosts/:userId', function(req, res, next) {
	
	var userId = req.params.userId;
	db.instaPosts.find({userId:userId}, function(err, docs) {
		if(err) {
	  		console.log("Error");
	  		res.send({"returnstatus":"error", "errors":err});
	  	}
	  	else if(!docs.length){
	  		console.log("No record with User id found");
	  		res.send({"returnstatus":"nodata"});
	  	}
	  	else{
			filterFollowing(docs[0].following);

	  	}
	}, filterFollowing);
	
	//return all the posts whom the user is following.
	function filterFollowing(following){
		var queryStr = [];
		for(var i =0 ;i<following.length ;i++){
			queryStr.push(following[i].userId);
		}
		db.instaPosts.find({ userId: { $in: queryStr } }, function(err, docs) {
			if(err) {
				console.log("Error");
				res.send({"returnstatus":"error", "errors":err});
			}
			else if(!docs.length){
				console.log("Not following any");
				res.send({"returnstatus":"nodata"});
			}
			else{
				res.send(docs);
			}
		});
	}
});

module.exports = router;
