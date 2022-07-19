require("dotenv").config();
require("../config/database");
const fs = require("fs");
const Theme = require("../models/ChatTheme");
let { themes } = JSON.parse(fs.readFileSync(__dirname + '/themes.json', 'utf8'));

(async () => {
    try {
        await Theme.deleteMany({});
        await Theme.insertMany(themes);
        console.log("Added to db");
    } catch(error) {
        console.error(error);
    }
})()
