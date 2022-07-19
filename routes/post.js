const router = require("express").Router();
const { isAuth } = require("../middleware/authMiddleware");
const catchAsync = require("../utils/catchAsync");
const post = require("../controllers/post");
const { postValidate, getPostRules, postAuthorization } = require("../middleware/validators/posts");

router.route("/posts/:id")
.get(isAuth, getPostRules, catchAsync(post.getPost))
.delete(isAuth, getPostRules, postAuthorization, catchAsync(post.delete));

router.route("/posts/edit/:id")
.get(isAuth, getPostRules, postAuthorization, catchAsync(post.renderEdit))
.post(isAuth, getPostRules, postAuthorization, postValidate, catchAsync(post.editPost));

router.route("/submit")
.get(isAuth, catchAsync(post.renderSubmit))
.post(isAuth, postValidate, catchAsync(post.submit));

router.route("/feed")
.get(isAuth, catchAsync(post.renderFeed));

router.route("/feed/:id")
.get(isAuth, getPostRules, catchAsync(post.getPosts));

module.exports = router;
