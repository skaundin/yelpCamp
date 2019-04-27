var express = require("express");
var router = express.Router({mergeParams: true});
var campground = require("../models/campground");
var middleware = require("../middleware");

//Campgrounds
router.get("/", function(req,res){
    campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            console.log(allCampgrounds);
            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser:req.user});
        }
    });

});

//Adding new campgrounds
router.get("/new",middleware.isLoggedIn ,function(req,res){
    res.render("campgrounds/new.ejs");
});

//Creating a route 
router.post("/", middleware.isLoggedIn ,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author =  {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name,image:image, descscription:desc, author};
    campground.create(newCampground, function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
    
    
    
});


router.get("/:id", function(req,res){
    campground.findById(req.params.id).populate("comments").exec( function(err,foundCampground){
        if(err){
            console.log(err);
        }else
        {
           console.log(req.param.id);
           console.log(foundCampground);
           res.render("campgrounds/show",{campground:foundCampground, currentUser:req.user});
        }
    });
    
});

//Edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    campground.findById(req.params.id, function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/edit", {campground:foundCampground});
        }
    });
    
});

//Update Campground 
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){

    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
        }else{
             res.redirect("/campgrounds/" + req.params.id);
        }
    });
   
});

//Delete campground 
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});




module.exports = router;