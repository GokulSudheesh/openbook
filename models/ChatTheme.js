const mongoose = require('mongoose');
const { Schema } = mongoose;

const themeSchema = new Schema(
    {
        name: { type: String, required: true },
        mainBg: { type: String, required: true },
        chatBg: { type: String, required: true },
        fromBg: { type: String, required: true },
        fromFont: { type: String, required: true },
        toBg: { type: String, required: true },
        toFont: { type: String, required: true },
        buttonBg: { type: String, required: true },
        buttonFont: { type: String, required: true },
        usernameFont: { type: String, required: true }
    }
);
module.exports = mongoose.model("Chat Theme", themeSchema);
