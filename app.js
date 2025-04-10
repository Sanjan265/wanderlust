if(process.env.NODE_ENV !== "production") {
require('dotenv').config();
}
console.log(process.env.SECRET) ;

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listings  = require("./routes/listing");
const review = require("./routes/review");
const sesssion = require("express-session");
const connectFlash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const user  = require("./routes/user");



const port = 8080;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));


main().then(()=>{console.log("sucessfull")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}






const sessionOptions = {
         secret: "mySuperSecretCode",
         resave:false,
         saveUninitialized:true,
         cookie:{
            expires:Date.now()+ 7 * 24 * 60 *60 * 1000,
            maxAge:7 * 24 * 60 *60 * 1000,
            httpOnly:true,
         },

};

app.get("/",(req,res)=>{
    res.send("working");
})

app.use(sesssion(sessionOptions));
app.use(connectFlash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



app.use("/listings", listings);
app.use("/listings/:id/reviews",review);
app.use("/",user);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!!"))
})

app.use((err,req,res,next)=>{
    let{status=500,message="Something went wrong"} = err;
    res.status(status).render("error.ejs" ,{message});
})


app.listen(port,()=>{
    console.log("server is listening to port 8080");
})