const ExpressError = require("../utils/ExpressError");

module.exports.isAuth =  (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/account/login");
    }
}

module.exports.notAuth =  (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect("/");
    } else {
        next();
    }
}

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        // throw new ExpressError("You are not authorized.", 403);
        next(new ExpressError("You are not authorized.", 403));
    }
}
