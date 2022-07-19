const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oidc');
const User = require("../models/User");
const { validPassword } = require("../utils/passwordUtils");

const customFields = { // Keep these names same in the form as well
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}

const verifyCallback = (req, username, password, done) => {
    User.findOne({ username: username }, async function(err, user) {
        if (err) { return done(err); }
        if (!user || !user.hash) {
            return done(null, false, req.flash("message", "Invalid Credentials" ));
        }
        const isValid = await validPassword(password, user.hash);
        if (!isValid) {
            return done(null, false, req.flash("message", "Invalid Credentials" ));
        }
        return done(null, user);
    });
}

const strategy = new LocalStrategy(customFields, verifyCallback);

const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async function(issuer, profile, cb) {
        // TODO: Add a random username instead
        const email = profile.emails[0].value
        const user = await User.findOneAndUpdate({ email }, { email, username: email }, { new: true, upsert: true })
        return cb(null, user);
    }
)

passport.use(strategy);
passport.use(googleStrategy);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
