const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listings");
const Reviews = require("../models/reviews");
const { validateReview,isLoggedIn, isReviewAuthor} = require("../middleware.js");





router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
   let listing = await Listing.findById(req.params.id);
   let newReview = new Reviews(req.body.reviews);
    newReview.author = req.user._id;
   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();
   req.flash("success","New review created");
   res.redirect(`/listings/${listing._id}`);
}))

router.delete("/:reviewsId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let{id,reviewsId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewsId}});
    await Reviews.findByIdAndDelete(reviewsId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}));


module.exports = router;