const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
    {
        comment: { type: String, required: true, maxLength: 500 },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
        createdAt: { type: Date, default: () => new Date().toISOString() }
    }
);

module.exports = mongoose.model("Comment", commentSchema);
