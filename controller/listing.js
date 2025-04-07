const Listing = require("../models/listings");
const { wrapAsync } = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");
const { saveRedirectUrl } = require("../middleware");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}

module.exports.newListing = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.showListing =  async(req,res)=>{
    let{id} = req.params;
   let listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("owner");
    
    if(!listing){
       req.flash("error","Listing does not exist");
       res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}

module.exports.createListing = async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
}   

module.exports.editListing = async (req, res) => {
    let{id} = req.params;
    const listing = await Listing.findById(id).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist");
        res.redirect("/listings");
     }
    res.render("./listings/edit.ejs",{listing});
}

module.exports.updateListing = async (req, res) => {
        let{id} = req.params;
       const edit = await Listing.findByIdAndUpdate(id,{...req.body.listing});
       req.flash("success"," listing edited");
       res.redirect(`/listings/${id}`);
 }

module.exports.deleteListing = async (req, res) => {
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}





