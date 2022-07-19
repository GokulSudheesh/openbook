const Comment = require("../models/Comment");

module.exports.submit = async (req, res, next) => {
  const errors = req.flash("errors");
  if (errors.length) return res.redirect(`/posts/${req.params.id}`);
  const newComment = new Comment({
    ...req.body,
    author: req.user,
    post: req.params.id
  });
  await newComment.save();
  res.redirect(`/posts/${req.params.id}`);
}

/* Get previous comments (pagination logic) */
module.exports.getComments = async (req, res, next) => {
  const { commentId, postId } = req.query; 
  const comment = await Comment.findOne({ _id: commentId });
  const comments = await Comment.find({ post: postId, _id: { $ne: commentId }, createdAt: { $lte: comment.createdAt }}).populate("author", "username profilePic").limit(10).sort({ createdAt: -1 });
  res.status(200).json({ comments });
}

module.exports.delete = async (req, res, next) => {
  const { commentId, postId } = req.query;
  await Comment.deleteOne({ _id: commentId });
  if (postId) {
    return res.redirect(200, `/posts/${postId}`)
  } else {
    return res.redirect(200, "/")
  }
}
