const Listing = require("./models/listing"); 
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){

        //redirectUrl save
        req.session.redirectUrl = req.originalUrl; // Save the original URL to redirect after login


        req.flash("error", "You must be logged in!");
        return res.redirect("/login"); // Redirect to login if not authenticated
    }
    next(); // Proceed to the next middleware or route handler
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Save the original URL to redirect after login
    }
    next(); // Proceed to the next middleware or route handler
}

//check if user is owner of the listing
module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "Only the Owners have permission to do changes!");
        return res.redirect(`/listings/${id}`); // Added return to prevent further execution
    }
    next(); // Proceed to the next middleware or route handler
}

// validate listing
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg); // Fixed: use ExpressError constructor correctly
    } else {
        next();
    }
};

// validate review
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new Error(400,errMsg);
    } else {
        next();
    }
};

//check if user is owner of the review
module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You did not create this review!");
        return res.redirect(`/listings/${id}`); // Added return to prevent further execution
    }
    next(); // Proceed to the next middleware or route handler
}