const { genPassword } = require("../utils/passwordUtils");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const ExpressError = require("../utils/ExpressError");

module.exports.renderRegister = (req, res) => {
    res.render("users/register", { req });
}

module.exports.register = async (req, res) => {
    const errors = req.flash("errors");
    if (errors.length) return res.render("users/register", { errors, req });
    
    const hash = await genPassword(req.body.password1);
    const newUser = new User({
        username: req.body.username,
        hash: hash
    });
    await newUser.save();
    res.redirect("/account/login");
}

module.exports.renderLogin = (req, res) => {
    const errors = req.flash("message");
    res.render("users/login", { errors, req });
}

module.exports.searchUsers = async (req, res) => {
    let { query } = req.query;
    if (!query) throw new ExpressError("Missing query", 400);
    query = query.replace(/([^a-z0-9]+)/gi, '');
    const users = await User.find({ username : { $regex: query, $options: 'i' } }).select("username profilePic");
    res.render("users/search", { users, req });
}

module.exports.logout = (req, res) => {
    req.logout();
    res.redirect("/");
}

module.exports.renderProfile = async (req, res) => {
    const user = await User.findOne({ username: req.params.username }).select("username profilePic");
    const posts = await Post.find({ 
        author: user._id, 
        isAnonymous: { $in: [req.user.username === req.params.username, false] } 
    })
    .populate("author", "username profilePic")
    .limit(10)
    .sort({ createdAt: -1 });
    const comments = await Comment.find({ author: user._id })
    .populate("author", "username profilePic")
    .limit(10)
    .sort({ createdAt: -1 });
    res.render("users/profile", { req, user, posts, comments });
}

/* Pagination logic for posts in user profile */
module.exports.getPosts = async (req, res) => {
    const user = await User.findOne({ username: req.params.username }).select("username profilePic");
    const post = await Post.findOne({ _id: req.query.postId });
    const posts = await Post.find({
        _id: { $ne: post._id },
        author: user._id, 
        isAnonymous: { $in: [req.user.username === req.params.username, false] }, 
        createdAt: { $lte: post.createdAt } 
    })
    .populate("author", "username profilePic")
    .limit(10)
    .sort({ createdAt: -1 });
    res.status(200).json({ posts });
}

/* Pagination logic for comments in user profile */
module.exports.getComments = async (req, res) => {
    const { commentId } = req.query; 
    const user = await User.findOne({ username: req.params.username }).select("username profilePic");
    const comment = await Comment.findOne({ _id: commentId });
    const comments = await Comment.find({ 
        author: user._id, 
        _id: { $ne: commentId }, 
        createdAt: { $lte: comment.createdAt }
    })
    .populate("author", "username profilePic")
    .limit(10)
    .sort({ createdAt: -1 });
    res.status(200).json({ comments });
}
