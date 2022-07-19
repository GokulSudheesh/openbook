const { ObjectId } = require("mongoose").Types;
const Post = require("../models/Post");
const Comment = require("../models/Comment");

module.exports.renderSubmit = async (req, res, next) => {
  res.render("post/create", { req });
}

module.exports.submit = async (req, res, next) => {
  const errors = req.flash("errors");
  if (errors.length) return res.render("post/create", { req, errors });
  const newPost = new Post({
    ...req.body,
    author: req.user
  });
  await newPost.save();
  res.redirect(`/posts/${newPost._id}`);
}

module.exports.getPost = async (req, res, next) => {
  const postId = req.params.id;
  const post = await Post.findOne({ _id: new ObjectId(postId) }).populate("author", "username profilePic");
  const comments = await Comment.find({ post: postId }).populate("author", "username profilePic").limit(10).sort({ createdAt: -1 });
  res.render("post/post", { req, post, comments });
}

module.exports.editPost = async (req, res, next) => {
  const post = await Post.findOne({ _id: new ObjectId(req.params.id) }).populate("author", "username profilePic");
  const errors = req.flash("errors");
  if (errors.length) return res.render("post/edit", { req, post, errors });
  await Post.updateOne({ _id: post._id }, { ...req.body });
  res.redirect(`/posts/${post._id}`);
}

module.exports.renderEdit = async (req, res, next) => {
  const post = await Post.findOne({ _id: new ObjectId(req.params.id) }).populate("author", "username profilePic");
  res.render("post/edit", { req, post });
}

module.exports.renderFeed = async (req, res, next) => {
  const posts = await Post.find({}).populate("author", "username profilePic").limit(10).sort({ createdAt: -1 });
  res.render("post/feed", { req, posts });
}

/* Get previous posts (pagination logic) */
module.exports.getPosts = async (req, res, next) => {
  const { id } = req.params; 
  const post = await Post.findOne({ _id: id });
  const posts = await Post.find({ _id: { $ne: id }, createdAt: { $lte: post.createdAt }}).populate("author", "username profilePic").limit(10).sort({ createdAt: -1 }).lean();
  posts.map(post => {
    if (post.isAnonymous) {
      delete post.author;
    }
    return post;
  })
  res.status(200).json({ posts });
}

module.exports.delete = async (req, res, next) => {
  await Post.deleteOne({ _id: req.params.id });
  res.redirect(200, "/")
}
