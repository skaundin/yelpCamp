var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    localStratergy = require("passport-local"),
    passport = require("passport"),
    User   = require("./models/user"),
    methodOverride = require("method-override"),
    seedDB    = require("./seeds");
    
var campgroundRoutes = require("./routes/campgrounds"),
    commentsRoutes   = require("./routes/comments"),
    indexRoutes      = require("./routes/index");
    
    
//mongodb://skaundin1122:MalharAug2015@ds115768.mlab.com:15768/yelpcamp123 
mongoose.connect('mongodb://suchita:MalharAug2015!@ds115768.mlab.com:15768/yelpcamp123');
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
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

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);
app.use("/",indexRoutes);




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});

