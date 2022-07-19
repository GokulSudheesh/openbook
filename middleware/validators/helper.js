const catchAsync = require("../../utils/catchAsync");
const ExpressError = require("../../utils/ExpressError");
const { validationResult } = require("express-validator");

module.exports.catchError = ({ code }) => (
  catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { msg } = errors.array({ onlyFirstError: false })[0]
      throw new ExpressError(msg, code || 500)
    }
    next();
  })
)
