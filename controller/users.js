const User = require("../models/user");

module.exports.signup = (req ,res)=>{
    res.render("users/signup.ejs");
}

module.exports.login = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
          req.flash("success","you are logged out!");
          res.redirect("/listings");
    })
}

module.exports.postSignup = async (req,res)=>{
    try{
        let{username,email,password}= req.body;
        const fakeUser = new User({username,email});
         const registeredUser = await User.register(fakeUser,password);
         req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success", "welcome to WanderLust");
            res.redirect("/listings");
         })
        
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
}

module.exports.postLogin = (req,res)=>{
        req.flash("success","Welcome back to WanderLust");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
     };




