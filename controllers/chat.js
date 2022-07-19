const User = require("../models/User");
const Message = require("../models/Message");
const ExpressError = require("../utils/ExpressError");
const { validationResult } = require("express-validator");
const { getUser } = require("../utils/socketUser");
const { getMessages, getLatestMessage } = require("../utils/socketMessage");

module.exports.renderChat = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new ExpressError(errors.errors[0].msg, 406);
    const { to } = req.query;
    // We find the recipient and read all the messages that they sent to the sender 
    const toUser = await User.findOne({username: to}).select("username profilePic") 
    await Message.updateMany({ from: toUser, to: req.user }, { $set: { read: true } })
    res.render("chat/chat", { toUser });
}

module.exports.renderInbox = async (req, res) => {
    // WTF is wrong with me??
    // TODO: this code is so shit
    const from = await Message.find({ $or: [
        {to: req.user}, 
        {from: req.user}
    ]}).distinct("from", { from: { $ne: req.user }}) 
    const to = await Message.find({ $or: [
        {to: req.user}, 
        {from: req.user}
    ]}).distinct("to", { to: { $ne: req.user }})
    let friends = await User.find({ _id: { $in: [...to, ...from] }}).select("username profilePic").lean()
    await Promise.all(friends.map(async friend => {
        const latestMessage = await getLatestMessage(req.user, friend)
        friend.text = latestMessage.text
        friend.read = latestMessage.from._id.equals(req.user._id) || latestMessage.read
        friend.date = latestMessage.date
        return friend
    }))
    const sorter = (a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    friends.sort(sorter)
    res.render("chat/inbox", { friends, req });
}

module.exports.getMessages = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new ExpressError(errors.errors[0].msg, 406);
    const fromUser = req.user;
    const toUser = await getUser({ username: req.query.to });
    const messages = await getMessages(fromUser, toUser);
    res.status(200).json({ messages });
}
