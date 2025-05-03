//basic (MAIN APP)
if(process.env.NODE_ENV != "production") {
require("dotenv").config(); // Load environment variables from .env file
}

express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const e = require("connect-flash");

// Set up middleware
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Configure EJS
app.engine('ejs', ejsMate); // Use ejsMate as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//connecting database
// const MONGO_URL="mongodb://127.0.0.1:27017/roamly";
const dbUrl = process.env.ATLAS_URL;
//checking for error in connection:
main()
    .then(() => {
        console.log("Connected to db");
    })
    .catch((err) =>{
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);  
}

//mongo store for session
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60, // time period in seconds
});

store.on("error", () => {
    console.log("Mongo session store error", err);
}
);
// Session and flash setup - MOVED EARLIER IN THE MIDDLEWARE CHAIN
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie   
    },
};


// Routes
// app.get("/", (req,res) => {
//     res.send("Hi, I am root");
// });



app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // Use the authenticate method from passport-local-mongoose

passport.serializeUser(User.serializeUser()); // Serialize user
passport.deserializeUser(User.deserializeUser()); // Deserialize user

// Flash middleware - make flash messages available to all templates
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // Make current user available in templates
    next();
});

// //fake user
// app.get("/demoUser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "student",
//     });

//     let registeredUser= await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });



// listing route (index route)
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ADDED: 404 handler middleware for routes that don't exist
app.use((req, res) => {
    res.status(404).render("error.ejs", { 
        message: "Page Not Found - 404 Error" 
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    let {statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs", { message });
}); 

// starting our server at port 8080
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});