var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    passport   = require("passport"),
    localStratergy = require("passport-local"),
    seedDB    = require("./seeds");
    
    
 
mongoose.connect('mongodb://localhost/yelpCamp');
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret: "Honda is my car",
    reSave: false,
    saveUnitialized: false
}));

//defining middleware
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


seedDB();  

app.get("/", function(req,res){
    res.render("landing");
});

app.get("/campgrounds", function(req,res){
    campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            console.log(allCampgrounds);
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });

});

app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new.ejs");
});

app.post("/campgrounds",function(req,res){
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

app.get("/campgrounds/:id", function(req,res){
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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
    campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    });
    
});

app.post("/campgrounds/:id/comments",isLoggedIn, function(req,res){
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

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "login"
        }),function(req,res){
    
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});

//middleware 

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});

