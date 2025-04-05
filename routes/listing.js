const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listings");
const {isLoggedIn,isOwner,validateListing,} = require("../middleware");



router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}))


router.get("/new",isLoggedIn,(req,res)=>{
    res.render("./listings/new.ejs");
})



router.get("/:id",wrapAsync(async(req,res)=>{
     let{id} = req.params;
    let listing = await Listing.findById(id)
     .populate({
         path: "review",
         populate: {
             path: "author",
         }
     })
     .populate("owner");
     if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
     }
     res.render("./listings/show.ejs",{listing});
}))

router.post("/", isLoggedIn,validateListing,wrapAsync(async(req,res)=>{
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
}));

router.get("/:id/edit",isOwner,isLoggedIn,wrapAsync(async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
     }
    res.render("./listings/edit.ejs",{listing});
}))

router.put("/:id",isLoggedIn, isOwner,validateListing,wrapAsync(async(req,res)=>{
     let{id} = req.params;
    const edit = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success"," listing edited");
    res.redirect(`/listings/${id}`);
}))

router.delete("/:id",isOwner,isLoggedIn,wrapAsync(async(req,res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}))


module.exports = router;