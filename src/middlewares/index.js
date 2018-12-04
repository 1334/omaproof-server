const {
  userAuthentication,
  groupAuthentication
} = require('./authentication/');
const { grandParentAuthentication } = require('./grandParentLogin');

const authentication = {
  Mutation: {
    createGroup: userAuthentication,
    selectGroup: userAuthentication,
    createPost: groupAuthentication,
    createComment: groupAuthentication,
    updateUser: groupAuthentication,
    deletePost: groupAuthentication,
    deleteComment: groupAuthentication,
    deleteTag: groupAuthentication,
    deleteUser: userAuthentication,
    deleteUserFromGroup: groupAuthentication
  },
  Query: {
    getGroups: userAuthentication,
    getUsers: groupAuthentication,
    getPosts: groupAuthentication,
    getComments: groupAuthentication,
    getTagsForPosts: groupAuthentication,
    getTagsForComments: groupAuthentication
  }
};

const questionService = {
  Mutation: {
    createGroup: userAuthentication
  },
  Query: {
    grandParentLogin: grandParentAuthentication
  }
};

const middlewares = [authentication, questionService];

module.exports = {
  middlewares
};
