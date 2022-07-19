const { body, param, validationResult } = require("express-validator");
const { ObjectId } = require("mongoose").Types;
const User = require("../../models/User");
const Filter = require("bad-words");
const filter = new Filter(); 
const { catchError } = require("./helper");

const registerPostRules = [
    // Username field
    body("username").trim()
    .matches(/^[a-zA-Z0-9]*$/).withMessage("Username must be alpha numeric")
    .isLength({ min: 5, max: 20 }).withMessage("Username must be 5-20 characters long.")
    .custom(async value => {
        const user = await User.exists({ username: value });
        if (user) {
          throw new Error("Username already in use");
        }
    })
    .custom(async value => {
        if (filter.isProfane(value)) {
            throw new Error("Kindly refrain from using swear words.");
        }
    }),
    // Password field
    body("password1")
    .isLength({ min: 8 }).withMessage("Please enter a password at least 8 characters long.")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/).withMessage("Please enter a password that contains at least one uppercase. At least one number. At least one lower case. At least one special character."),
    // Password confirmation
    body("password2").custom((value, { req }) => {
        if (value !== req.body.password1) {
          throw new Error("Password confirmation does not match password");
        }    
        return true;
    })
];

const loginPostRules = [
    // Username field
    body("username").not().isEmpty().withMessage("Username field cannot be empty."),
    // Password field
    body("password").not().isEmpty().withMessage("Password field cannot be empty.")
];

const getUserRules = [
    param("username")
    .custom(async value => {
        const user = await User.exists({ username: value });
        if (!user) throw new Error("User does not exist.");
    }),
	catchError({ code: 404 })
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    req.flash("errors", errors.mapped())
    // for (const error of errors.errors) {
    //     req.flash("errors", error.msg);
    // }
    next();
}

module.exports = {
    registerValidate: [...registerPostRules, validate],
    loginValidate: [...loginPostRules, validate],
    getUserRules,
}
