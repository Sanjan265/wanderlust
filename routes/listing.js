const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListing,} = require("../middleware");
const controllerListing = require("../controller/listing");


router.route("/").get(wrapAsync(controllerListing.index)).post(isLoggedIn,validateListing,wrapAsync(controllerListing.createListing));
router.get("/new",isLoggedIn,controllerListing.newListing);
router.get("/:id",wrapAsync(controllerListing.showListing)).put(isLoggedIn, isOwner,validateListing,wrapAsync(controllerListing.updateListing)).delete("/:id",isOwner,isLoggedIn,wrapAsync(controllerListing.deleteListing));
router.get("/:id/edit",isOwner,isLoggedIn,wrapAsync(controllerListing.editListing));

module.exports = router;