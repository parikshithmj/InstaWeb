var express = require('express');
//for uploading images.
var multer  = require('multer')
var upload = multer({ dest: './uploads/' })

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
router.get('/api/listLikedUsers/:postId', function(req, res, next) {
	
	var userId = req.params.userId;
	db.instaPosts.find({postId:postId}, function(err, docs) {
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
router.put("/api/addComment/:postId",function(req,res){
    var response = {};
	var userId = req.query.userId;
	var comment = req.query.comment;
	 		
	db.instaPosts.update({postId:req.params.postId}, { $push: { comments: {userId: userId,comment:comment } }},function(err, items){
        if (err) return res.send(500, err);
		res.json({"result":items});
    
	});
});


//Modify the post - Like the post.
router.put("/api/likePost/:postId",function(req,res){
    var response = {};
	 		
	db.instaPosts.update({postId:req.params.postId}, { $push: { likes: {userId: userId }}},function(err, items){
        if (err) return res.send(500, err);
		res.json({"result":items});
    
	});
});


//Modify the post - Like the post.
router.put("/api/unlikePost/:postId",function(req,res){
    var response = {};
	 		
	db.instaPosts.update({postId:req.params.postId}, { $pull: { likes: {userId: userId }}},function(err, items){
        if (err) return res.send(500, err);
		res.json({"result":items});
    
	});
});

//Image file upload API along with its other attributes 
router.post("/api/uploadPost/",upload.single('pic'),function(req, res,next){
    console.log('file info: ',req.files);
	
	var post = {};
	for(var key in req.body){
			post[key] = req.body[key];
	}
	var currentDate = new Date();
	//if date needed in mm/dd/yyyy format
	//var date = (currentDate.getMonth()+1) +'/'+currentDate.getDate()+'/'+currentDate.getFullYear();
	post["date"] = currentDate;
	
	
	console.log("Id is"+db._id);

	if(req.file)
		post.itemImageURL = req.file.path;
    console.log(JSON.stringify(post));   	
    
	db.instaPosts.insert(post , function (err, doc) {
								if(err){
									console.log("error " + err);
									res.send({"regstatus":"error", "errors":err});
								}
								else{
									res.json({"response" : "Post added"});
								}
	});
    

});


module.exports = router;
