const { body, query, validationResult } = require("express-validator");
const { ObjectId } = require("mongoose").Types;
const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
const sanitizeHtml = require("sanitize-html");
const clean = require("../../utils/profanity");
const { catchError } = require("./helper");

const commentPostRules = [
  // Comment field
  body("comment").trim()
  .customSanitizer(value => {
      if (!value) return
      return clean(sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
  })
  .not().isEmpty().withMessage("Comment cannot be empty.")
  .isLength({ max: 500 }).withMessage("Max 500 characters sorry.")
];

const getCommentRules = [
  query("postId")
  .custom(async value => {
      if (!ObjectId.isValid(value)) throw new Error("Invalid post id.")
      const post = await Post.exists({ _id: value });
      if (!post) throw new Error("Post does not exist.");
  }),
  query("commentId")
  .custom(async value => {
      if (!ObjectId.isValid(value)) throw new Error("Invalid comment id.")
      const comment = await Comment.exists({ _id: value });
      if (!comment) throw new Error("Comment does not exist.");
  }),
  catchError({ code: 404 })
];

const getCommentRulesOptional = [
  query("postId").optional()
  .custom(async value => {
      if (!ObjectId.isValid(value)) throw new Error("Invalid post id.")
      const post = await Post.exists({ _id: value });
      if (!post) throw new Error("Post does not exist.");
  }),
  query("commentId")
  .custom(async value => {
      if (!ObjectId.isValid(value)) throw new Error("Invalid comment id.")
      const comment = await Comment.exists({ _id: value });
      if (!comment) throw new Error("Comment does not exist.");
  }),
  catchError({ code: 404 })
];

const getCommentRulesQuery = [
  query("commentId")
  .custom(async value => {
      if (!ObjectId.isValid(value)) throw new Error("Invalid comment id.")
      const comment = await Comment.exists({ _id: value });
      if (!comment) throw new Error("Comment does not exist.");
  }),
  catchError({ code: 404 })
];

const commentAuthorization = [
  query("commentId")
  .custom(async (value, { req }) => {
      const comment = await Comment.findOne({ _id: value }).populate("author");
      if (req.user.username !== comment.author.username) throw new Error("You are not the author bruh.");
  }),
  catchError({ code: 403 })
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  req.flash("errors", errors.mapped());
  next();
}

module.exports = {
  commentValidate: [...commentPostRules, validate],
  getCommentRules,
  getCommentRulesOptional,
  commentAuthorization,
  getCommentRulesQuery,
}
