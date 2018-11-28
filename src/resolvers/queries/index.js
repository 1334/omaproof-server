const {
  getComments,
  getPosts,
  getTagsForComments,
  getTagsForPosts
} = require('./content');
const { getGroups } = require('./groups');
const { getUsers } = require('./users');

module.exports = {
  getGroups,
  getUsers,
  getPosts,
  getComments,
  getTagsForPosts,
  getTagsForComments
};
