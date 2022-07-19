const mongoose = require("mongoose");
const { Schema } = mongoose;

const activeUsersSchema = new Schema(
    {
        clientId: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    }
);

module.exports = mongoose.model("Active User", activeUsersSchema);
