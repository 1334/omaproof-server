const {
  userAuthentication,
  groupAuthentication
} = require('./authentication/');

const authentication = {
  Mutation: {
    createGroup: userAuthentication,
    selectGroup: userAuthentication,
    createPost: groupAuthentication,
    createComment: groupAuthentication,
    deletePost: groupAuthentication,
    deleteComment: groupAuthentication,
    deleteTag: groupAuthentication,
    deleteUser: userAuthentication,
    deleteUserFromGroup: groupAuthentication
  }
};

const test = {
  Query: {
    getGroups: userAuthentication,
    getUsers: groupAuthentication,
    getPosts: groupAuthentication,
    getComments: groupAuthentication,
    getTagsForPosts: groupAuthentication,
    getTagsForComments: groupAuthentication
  }
};

const middlewares = [authentication, test];

module.exports = {
  middlewares
};
