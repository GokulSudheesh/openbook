let loggerMode = "combined";
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
    loggerMode = "dev";
}
require("./config/database");
const http = require("http");
const socketio = require("socket.io");
const express = require("express");
const manageSocket = require("./socket");
const morgan = require("morgan");
const path = require("path");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const mongoSanitize = require("express-mongo-sanitize");
const session = require("express-session");
const passport = require("passport");
const routes = require("./routes");
const MongoStore = require("connect-mongo");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// Logger
app.use(morgan(loggerMode));

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize({
    replaceWith: "_"
}));

const sessionStore = MongoStore.create({
    mongoUrl: process.env.DB_STRING,
    collectionName: "sessions",
    touchAfter: 24 * 60 * 60 // 1 Day
});
  
const sessionMiddleware = session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7 // Expires: 1 week
    }
});

app.use(sessionMiddleware);
app.use(flash());

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

io
.use((socket, next) => {
    // Wrap the express middleware
    sessionMiddleware(socket.request, {}, next);
})
.on("connection", manageSocket);

app.use(routes);

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.statusMessage) err.statusMessage = "Internal error. Something went wrong."
    res.status(statusCode).render("error", { err, req })
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Serving on port ${port}`)
});
