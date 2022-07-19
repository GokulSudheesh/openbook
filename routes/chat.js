const router = require("express").Router();
const { isAuth } = require("../middleware/authMiddleware");
const catchAsync = require("../utils/catchAsync");
const chat = require("../controllers/chat");
const { chatRules } = require("../middleware/validators/chat");

router.get("/", isAuth, chatRules, catchAsync(chat.renderChat));

router.get("/messages", isAuth, chatRules, catchAsync(chat.getMessages));

router.get("/inbox", isAuth, catchAsync(chat.renderInbox));

module.exports = router;
