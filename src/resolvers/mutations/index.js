const contentResolvers = require('./content/contentResolvers');
const groupResolvers = require('./groups/groupResolvers');
const userResolvers = require('./users/userResolvers');

module.exports = {
  ...contentResolvers,
  ...groupResolvers,
  ...userResolvers
};
