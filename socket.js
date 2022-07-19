const { userJoin, userLeave, randomTheme, getUser, getActiveUser } = require("./utils/socketUser");
const { formatMessage } = require("./utils/socketMessage");

module.exports = async socket => {
    try{
        const userId = socket.request.session.passport.user;
        if (!userId) return
        // console.log("User is:", userId);
        const { user } = await userJoin(socket.id, userId);
        socket.emit("theme", { theme: await randomTheme() });
        // console.log("Yeeeeet", user);

        // Client sends a chat message
        socket.on("clientMessage", async ({message, to}) => {
            const toUser = await getUser({ username: to });
            // console.log(`From: ${user.username} Message: "${message}" To: ${toUser.username}`);
            message = formatMessage(user, toUser, message);
            if (!message) return
            socket.emit("message", {...message, from: {...message.from, username: "You" }}); // Return to sender
            // Only emit to the receiver if they are active
            const toUserClient = await getActiveUser({ user: toUser });
            if (toUserClient) {
                socket.to(toUserClient.clientId).emit("message", message); // Send to receiver
            }
        });

        // Runs when a client disconnects
        socket.on("disconnect", async () => {
            console.log(`Client - ${socket.id} disconnected.`);
            await userLeave(socket.id);
        });
    } catch (err) {
        console.log(err);
    }
}
