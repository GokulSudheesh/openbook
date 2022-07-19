const mongoose = require("mongoose");
const { Schema } = mongoose;

const generateRandomProfilePic = () => {
    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    }
    return `/images/profile/profile-${getRandomInt(6)}.jpg`;
}

const UserSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: false, unique: true, sparse: true },
        hash: { type: String, required: true },
        admin: { type: Boolean, default: false },
        profilePic: { type: String, default: generateRandomProfilePic },
        createdAt: { type: Date, default: () => new Date().toISOString() }
    }
);

module.exports = mongoose.model("User", UserSchema);
