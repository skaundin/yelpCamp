var express = require("express");
var router = express.Router({mergeParams: true})
    campground = require("../models/campground"),
    Comment    = require("../models/comment");
    

//Comments - new 
router.get("/new", isLoggedIn, function(req,res){
    campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground, currentUser:req.user});
        }
    });
    
});

//Comments
router.post("/",isLoggedIn, function(req,res){
    campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment,function(err,newCreatedComment){
                if(err){
                    console.log(err);
                    res.redirect("/campgrounds");
                }else{
                    campground.comments.push(newCreatedComment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//middleware 
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

module.exports = router;