const Message = require("../models/Message");
const sanitizeHtml = require("sanitize-html");
const clean = require("./profanity")

function formatMessage(from, to, text) {
    const date = new Date();
    text = clean(sanitizeHtml(text.trim().slice(0, 500), { allowedTags: [], allowedAttributes: {} }));
    if (!text) return
    const newMessage = new Message(
        {
            text,
            from,
            to,
            date
        }
    );
    const errors = newMessage.validateSync();
    if (errors) return
    newMessage.save();
    return {
        from: { username: from.username, profilePic: from.profilePic },
        text,
        date
    };
}

// NOTE: User 1 is the user making the request grab this from cookie
async function getMessages(user1, user2){
    const messages = await Message.find({ 
        $or: [
            {to: user1._id, from: user2._id}, 
            {to: user2._id, from: user1._id}
        ]
    })
    .populate("from", "username profilePic")
    .populate("to", "username profilePic")
    .limit(100).sort('date').lean();
    messages.map(message => {
        message.from.username = (message.from.username == user1.username) ? "You" : message.from.username;
    });
    return messages;
}

async function getLatestMessage(user1, user2){
    const message = await Message.findOne({ 
        $or: [
            {to: user1._id, from: user2._id}, 
            {to: user2._id, from: user1._id}
        ]
    })
    .select('from text read date')
    .sort('-date').lean();
    return message;
}

module.exports = {
    formatMessage,
    getMessages,
    getLatestMessage,
};
