const content = require('./content');
const groups = require('./groups');
const users = require('./users');

module.exports = {
  ...content,
  ...groups,
  ...users
};
