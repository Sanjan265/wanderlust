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
    
})


module.exports = mongoose.model("Reviews", reviewSchema);