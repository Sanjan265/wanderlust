const Joi = require("joi");
const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema({
    Comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    created_at:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
        
})


module.exports = mongoose.model("Reviews", reviewSchema);