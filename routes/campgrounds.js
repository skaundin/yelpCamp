var express = require("express");
var router = express.Router({mergeParams: true});
var campground = require("../models/campground");

//Campgrounds
router.get("/", function(req,res){
    campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            console.log(allCampgrounds);
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });

});

//Adding new campgrounds
router.get("/new", function(req,res){
    res.render("campgrounds/new.ejs");
});

router.post("/",function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name,image:image, descscription:desc};
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
           res.render("campgrounds/show",{campground:foundCampground});
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