const Listing = require("../models/listings");


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
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
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
     let originalImageUrl = listing.image.url;
     originalImageUrl =  originalImageUrl.replace("/upload","/upload/w_250");
     res.render("./listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing = async (req, res) => {
        let{id} = req.params;
       const edit = await Listing.findByIdAndUpdate(id,{...req.body.listing});
       if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        edit.image = {url,filename};
        await edit.save();
       }
       
       req.flash("success"," listing edited");
       res.redirect(`/listings/${id}`);
 }

module.exports.deleteListing = async (req, res) => {
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}





