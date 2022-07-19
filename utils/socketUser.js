const ActiveUser = require("../models/ActiveUser");
const User = require("../models/User");
const ChatTheme = require("../models/ChatTheme");

async function randomTheme() {
    const count = await ChatTheme.countDocuments().exec();
    const random = Math.floor(Math.random() * count);
    const randomTheme = await ChatTheme.findOne().skip(random).exec();
    return randomTheme;
}

function userJoin(clientId, userId) {
    return ActiveUser.findOneAndUpdate({ user: userId }, { clientId }, {
        new: true,
        upsert: true
    }).populate("user", "username profilePic");
}

function userLeave(id){
    return ActiveUser.findOneAndDelete({ clientId: id });
}

// Get user with a condition (either userId or username)
function getUser(cond){
    return User.findOne(cond).select("username");
}

function getActiveUser(cond){
    return ActiveUser.findOne(cond);
}

module.exports = { 
    userJoin,
    userLeave,
    randomTheme,
    getUser,
    getActiveUser
}