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
    updateUser: groupAuthentication
  }
};

const middlewares = [authentication];

module.exports = {
  middlewares
};
