const Filter = require('bad-words'),
  filter = new Filter();

module.exports = (value) => {
  try {
    return value && filter.clean(value);
  } catch (error) {
    return value;
  }
};
