const router = require("express").Router();
const user = require("./users");
const chat = require("./chat");
const post = require("./post");
const comment = require("./comment");

router.use("/account", user);
router.use("/chat", chat);
router.use("/comments", comment);
router.use("/", post);

router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/feed");
    } else {
        res.render("home", { req });
    }
});

module.exports = router;
