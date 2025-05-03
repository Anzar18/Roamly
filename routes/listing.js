// Import required modules
const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js"); // Import the storage configuration from cloudConfig.js
const upload = multer({ storage }); // Set the destination for uploaded files

// Index and Create route
router.route("/") 
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, 
        upload.single('listing[image]'),
        validateListing,
         wrapAsync(listingController.createListing)
        );
    
// New Route (Create form) - Make sure renderNewForm is defined
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, Update and Delete route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, 
        upload.single('listing[image]'),
        validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Export the router
module.exports = router;