const mongoose = require("mongoose");
const { Schema } = mongoose;

const postTypes = ['Off My Chest', 'Motivational'];

const postSchema = new Schema(
    {
        title: { type: String, required: true, maxLength: 100 },
        content: { type: String, required: true, maxLength: 800 },
        type: { type: String, enum: postTypes, default: 'Off My Chest' },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        isAnonymous: { type: Boolean, default: false, required: true },
        createdAt: { type: Date, default: () => new Date().toISOString() }
    }
);

module.exports = mongoose.model("Post", postSchema);
module.exports.postTypes = postTypes;
