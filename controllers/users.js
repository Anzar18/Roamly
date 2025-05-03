
const User = require("../models/user"); // Import the User model

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    
    try{
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);    
        req.login(registeredUser, (err) => {
            if(err){
                return next(err); // Pass the error to the next middleware
            }
            req.flash("success", "Welcome to Roamly!"); // Flash message for successful signup
            res.redirect("/listings"); // Redirect to listings page after signup
        });
    } catch (e) {
   
        req.flash("error", e.message); // Flash message for error
        res.redirect("/signup"); // Redirect back to signup page on error
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Roamly!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // Use the saved redirect URL or default to listings
    res.redirect(redirectUrl); // Redirect to page after login
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Pass the error to the next middleware
            
        }
        req.flash("success", "You are logged out!"); // Flash message for successful logout
        res.redirect("/listings"); // Redirect to listings page after logout
    });
};