const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const { validateReview,isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/reviews");





router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.newReview));
router.delete("/:reviewsId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));





module.exports = router;