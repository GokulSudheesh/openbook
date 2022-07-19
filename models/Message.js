const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
    {
        text: { type: String, required: true, maxLength: 500 },
        from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, required: true },
        read: {type: Boolean, default: false}
    }
);
module.exports = mongoose.model("Message", messageSchema);
