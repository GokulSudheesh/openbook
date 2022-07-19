const bcrypt = require("bcrypt");
const saltRounds = 10;

function genPassword(password) {
    return bcrypt.hash(password, saltRounds);
}

function validPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

module.exports = { 
    validPassword,
    genPassword
};
