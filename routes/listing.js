const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const controllerListing = require("../controller/listing");
const multer  = require('multer')
const {storage} = require("../cloudconfig");
const upload = multer({ storage })

router
  .route("/")
  .get(wrapAsync(controllerListing.index))
  .post(isLoggedIn,upload.single("listing[image][url]"),validateListing,wrapAsync(controllerListing.createListing));
  
router.get("/new", isLoggedIn, controllerListing.newListing);

router
  .route("/:id")
  .get(wrapAsync(controllerListing.showListing))
  .put(isLoggedIn, isOwner,upload.single("listing[image][url]"), validateListing,wrapAsync(controllerListing.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(controllerListing.deleteListing)); 

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(controllerListing.editListing));



module.exports = router;