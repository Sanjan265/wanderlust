const mongoose = require("mongoose");
const Reviews = require("./reviews");
const { ref } = require("joi");




const listingSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: {
      url: String,
      filename: String,
      },
    price: Number,
    location: String,
    country: String,
    reviews :[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Reviews",
      }
    ],
    owner:{ 
          type:mongoose.Schema.Types.ObjectId,
          ref:"User",
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Reviews.deleteMany({_id:{$in:listing.reviews}});
  }
   
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;