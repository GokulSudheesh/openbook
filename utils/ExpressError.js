class ExpressError extends Error {
    constructor(statusMessage, statusCode) {
        super();
        this.statusMessage  = statusMessage;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;
