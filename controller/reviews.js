const Listing = require('../models/listings');
const Reviews = require('../models/reviews');

module.exports.newReview = async (req, res) => {
    
        let listing = await Listing.findById(req.params.id);
        let newReview = new Reviews(req.body.reviews);
         newReview.author = req.user._id;
        listing.reviews.push(newReview);
     
        await newReview.save();
        await listing.save();
        req.flash("success","New review created");
        res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
    let{id,reviewsId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewsId}});
    await Reviews.findByIdAndDelete(reviewsId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}