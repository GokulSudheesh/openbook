const router = require("express").Router();
const passport = require("passport");
const users = require("../controllers/users");
const { notAuth, isAuth } = require("../middleware/authMiddleware");
const { registerValidate, getUserRules } = require("../middleware/validators/users");
const { getPostRulesQuery } = require("../middleware/validators/posts");
const { getCommentRulesQuery } = require("../middleware/validators/comments");
const catchAsync = require("../utils/catchAsync");

router.route("/login")
.get(notAuth, users.renderLogin)
.post(notAuth, passport.authenticate("local", 
    { 
        successRedirect: "/", 
        failureRedirect: "/account/login" 
    }
));

router.route("/register")
.get(notAuth, users.renderRegister)
.post(notAuth, registerValidate, catchAsync(users.register));

router.get('/login/google', passport.authenticate('google', {
    scope: [ 'email' ]
}));

router.get('/oauth2/redirect/openbook',
    passport.authenticate('google', { failureRedirect: "/account/login", failureMessage: true }),
    function(req, res) {
        res.redirect('/');
    }
);

router.get("/logout", users.logout);

router.get("/search", isAuth, catchAsync(users.searchUsers));

router.get("/profile/:username", isAuth, getUserRules, catchAsync(users.renderProfile));

router.get("/posts/:username", isAuth, getUserRules, getPostRulesQuery, catchAsync(users.getPosts));

router.get("/comments/:username", isAuth, getUserRules, getCommentRulesQuery, catchAsync(users.getComments));

module.exports = router;
