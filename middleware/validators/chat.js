const { query } = require("express-validator");
const User = require("../../models/User");

const chatRules = [
    // Recipient field
    query("to").not().isEmpty().withMessage("No recipient provided.")
    .custom(async (value, { req }) => {
        if (value === req.user.username) {
            throw new Error("Use your inside voice.");
        }
        const user = await User.exists({ username: value });
        if (!user) {
            throw new Error("User does not exist.");
        }
    })
];

module.exports = {
    chatRules
}
