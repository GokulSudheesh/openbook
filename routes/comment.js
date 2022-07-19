const router = require("express").Router();
const { isAuth } = require("../middleware/authMiddleware");
const catchAsync = require("../utils/catchAsync");
const comment = require("../controllers/comment");
const { commentValidate, getCommentRules, getCommentRulesOptional, commentAuthorization } = require("../middleware/validators/comments");
const { getPostRules } = require("../middleware/validators/posts");

router.route("/submit/:id")
.post(isAuth, getPostRules, commentValidate, catchAsync(comment.submit));

router.route("/comment")
.delete(isAuth, getCommentRulesOptional, commentAuthorization, catchAsync(comment.delete));

router.route("/feed")
.get(isAuth, getCommentRules, catchAsync(comment.getComments));

module.exports = router;
