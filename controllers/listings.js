const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    
    res.render("./listings/new.ejs");
};

module.exports.showListing = async(req, res) => {
    let {id} = req.params;
    
    const listing = await Listing.findById(id)
    .populate({path: "reviews", populate: {path: "author",
        
    },
    })
    .populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings"); // Added return to prevent further execution
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
//geocoding
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();

    const listingData = req.body.listing;
    let url = req.file.path;
    let filename = req.file.filename;
    // Check if image is provided as a simple string and convert to object structure
    if (listingData.image && typeof listingData.image === 'string') {
        listingData.image = {
            url: listingData.image
        };
    }
   
    const newListing = new Listing(listingData);
    newListing.owner = req.user._id; // Set the owner to the current user
    newListing.image = {
        url: url,
        filename: filename
    };
    newListing.geometry = response.body.features[0].geometry; // Set the geometry from geocoding response
    let savedListing = await newListing.save();
    console.log("Saved listing:", savedListing); // Debug log

    req.flash("success", "New listing created!");
    console.log("New listing created:", newListing);
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    
    // Fix the ID if it has "listings" prepended
    if (id.startsWith('listings')) {
        id = id.substring(8); // Remove the first 8 characters ("listings")
    }
    
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings"); // Added return to prevent further execution
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    
    // Fix the ID if it has "listings" prepended
    if (id.startsWith('listings')) {
        id = id.substring(8); // Remove the first 8 characters ("listings")
    }
    
    console.log("Before update:", req.body.listing); // Debug log
    
    // Make sure we don't lose the existing image data
    const listing = await Listing.findById(id);
    
    // Create an update object with all the form data
    const updateData = {...req.body.listing};
    
    // Handle special case for the image
    if (!updateData.image || !updateData.image.url) {
        // If no new image is provided, keep the old one
        updateData.image = listing.image;
    }
    
    console.log("Update data:", updateData); // Debug log
    
    // Update the listing with all data
    let updatedListing = await Listing.findByIdAndUpdate(id, updateData, { runValidators: true });
    if(typeof req.file !=="undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = {
        url: url,
        filename: filename
    };
    await updatedListing.save(); // Save the updated listing
}
    req.flash("success", "Listing Updated!");

    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    // Fix the ID if it has "listings" prepended
    if (id.startsWith('listings')) {
        id = id.substring(8); // Remove the first 8 characters ("listings")
    }
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
};