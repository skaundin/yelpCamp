var express = require("express"),
    router  = express.Router({mergeParams: true}),
    User   = require("../models/user"),
    passport = require("passport");

//home page  
router.get("/", function(req,res){
    res.render("landing");
});

//register 
router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

//login
router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login",passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "login"
        }),function(req,res){
    
});

//logout 
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/campgrounds");
});

//middleware 
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","Please login in first!");
        res.redirect("/login");
    }
}

module.exports = router;