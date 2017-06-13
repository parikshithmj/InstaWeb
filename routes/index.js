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

//GET who has liked the post
router.get('/api/listLikedUsers/:userId', function(req, res, next) {
	
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
			res.send(docs[0].likes);

	  	}
	});
});
	


//Modify the post - Add a comment.
router.put("/api/addComment/:owner",function(req,res){
    var response = {};
	var userId = req.query.userId;
	var comment = req.query.comment;
	 		
	db.instaPosts.update({userId:req.params.owner}, { $push: { comments: {userId: userId,comment:comment } }},function(err, items){
        if (err) return res.send(500, err);
		res.json({"result":items});
    
	});
});


//Modify the post - Like the post.
router.put("/api/likePost/:owner",function(req,res){
    var response = {};
	var userId = req.query.userId;
	 		
	db.instaPosts.update({userId:req.params.owner}, { $push: { likes: {userId: userId }}},function(err, items){
        if (err) return res.send(500, err);
		res.json({"result":items});
    
	});
});


//Modify the post - Like the post.
router.put("/api/unlikePost/:owner",function(req,res){
    var response = {};
	var userId = req.query.userId;
	 		
	db.instaPosts.update({userId:req.params.owner}, { $pull: { likes: {userId: userId }}},function(err, items){
        if (err) return res.send(500, err);
		res.json({"result":items});
    
	});
});


module.exports = router;
