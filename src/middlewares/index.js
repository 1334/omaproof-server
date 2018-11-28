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
    deletePost: groupAuthentication
  }
};

const middlewares = [authentication];

module.exports = {
  middlewares
};
