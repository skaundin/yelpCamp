var express = require("express");
var router = express.Router({mergeParams: true}),
    campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");
    

//Comments - new 
router.get("/new", middleware.isLoggedIn, function(req,res){
    campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground, currentUser:req.user});
        }
    });
    
});

//Comments
router.post("/",middleware.isLoggedIn, function(req,res){
    campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment,function(err,newCreatedComment){
                if(err){
                    console.log(err);
                    res.redirect("/campgrounds");
                }else{
                    //add username and id to the comment 
                    newCreatedComment.author.id = req.user._id;
                    newCreatedComment.author.username = req.user.username;
                    newCreatedComment.save();
                    campground.comments.push(newCreatedComment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});



module.exports = router;