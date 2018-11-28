const {
  createPost,
  createComment,
  deletePost,
  deleteComment,
  deleteTag
} = require('./content/contentResolvers');
const {
  selectGroup,
  createGroup,
  deleteUserFromGroup
} = require('./groups/groupResolvers');
const {
  createUser,
  login,
  updateUser,
  deleteUser
} = require('./users/userResolvers');

module.exports = {
  createUser,
  login,
  createGroup,
  selectGroup,
  createPost,
  createComment,
  updateUser,
  deletePost,
  deleteComment,
  deleteTag,
  deleteUser,
  deleteUserFromGroup
};
