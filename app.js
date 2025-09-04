if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}


const express = require("express");


const cors = require("cors");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");



// Login
const session = require("express-session");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport")
const LocalStrategy = require("passport-local")
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const path = require("path");

const methodOverride = require("method-override");




const User = require("./models/User/user.js")

const app = express();

// Routing
const placementdrive = require('./routes/placement/placement.js');
const hackathon = require('./routes/hackathon/hackathon.js');
const experiance = require('./routes/experiance/experiance.js');
const dsa = require('./routes/DSA/dsa.js');
const auth = require("./routes/User/authentication.js");
const profile = require("./routes/Profile/student.js")
const admin = require("./routes/admin/admin.js");
const recommendation = require("./routes/recommendation/recommendation.js");


// ATLAS MONGODB Connection
const DBURL = process.env.MONGODB_ATLAS_URL;
main().then(() => { console.log("Mongoose Connect") }).catch((err) => { console.log(err) });

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(cors());



async function main() {
  mongoose.connect(DBURL);
}




const store = MongoStore.create({
  mongoUrl: DBURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter:24*3600,
})
store.on("error",(err)=>{
  console.log("Error in mongo-session",err)
})
const sessionOption = {
  store,
    secret: process.env.SECRET, resave: false, saveUninitialized: true, cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}
app.use(session(sessionOption));
app.use(flash());




// Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// Google OAuth20
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URI
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // check if user exists
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName   // optional: use Google name
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});



// Placement All  Route
app.use("/placementdrive", placementdrive);
// Hackathon All Route
app.use("/hackathon", hackathon);
// Experiance All Route
app.use("/experiance", experiance);
// DSA All Route
app.use("/dsa", dsa);
// Authenthication
app.use("/", auth);
//admin
app.use("/admin", admin);
//Recommandation
app.use("/notify", recommendation);
// Profile
app.use("/:id/profile", profile);
// home
app.use("/home", (req, res) => {
  res.render("Home/home.ejs");
})




// After all your routes

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
})
app.listen(8080, () => {
  console.log("Server Runing On 8080 Port")
})


