const { body, param, query, validationResult } = require("express-validator");
const { ObjectId } = require("mongoose").Types;
const Post = require("../../models/Post");
const { postTypes } = require("../../models/Post");
const sanitizeHtml = require("sanitize-html");
const clean = require("../../utils/profanity");
const { catchError } = require("./helper");

const postPostRules = [
    // Title field
    body("title").trim()
    .customSanitizer(value => {
        if (!value) return
        return clean(sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
    })
    .not().isEmpty().withMessage("Title cannot be empty.")
    .isLength({ max: 100 }).withMessage("Max 100 characters sorry."),
    // Content field
    body("content").trim()
    .customSanitizer(value => {
        if (!value) return
        return clean(sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }));
    })
    .not().isEmpty().withMessage("Content cannot be empty.")
    .isLength({ max: 800 }).withMessage("Max 800 characters sorry."),
    // Post type
    body("type").isIn(postTypes).withMessage("Invalid post type."),
    // Post anonymity
    body("isAnonymous")
    .customSanitizer(value => {
        if (!value) return "false";
        return "true";
    })
];

const getPostRules = [
    param("id")
    .custom(async value => {
        if (!ObjectId.isValid(value)) throw new Error("Invalid post id.")
        const post = await Post.exists({ _id: value });
        if (!post) throw new Error("Post does not exist.");
    }),
	catchError({ code: 404 })
];

const getPostRulesQuery = [
    query("postId")
    .custom(async value => {
        if (!ObjectId.isValid(value)) throw new Error("Invalid post id.")
        const post = await Post.exists({ _id: value });
        if (!post) throw new Error("Post does not exist.");
    }),
	catchError({ code: 404 })
];

const postAuthorization = [
    param("id")
    .custom(async (value, { req }) => {
        const post = await Post.findOne({ _id: value }).populate("author");
        if (req.user.username !== post.author.username) throw new Error("You are not the author bruh.");
    }),
    catchError({ code: 403 })
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
    postValidate: [...postPostRules, validate],
    getPostRules,
    postAuthorization,
    getPostRulesQuery,
}
