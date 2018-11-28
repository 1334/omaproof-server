const {
  userAuthentication,
  groupAuthentication
} = require('./authentication/');

const middleware1 = {
  Mutation: {
    createGroup: userAuthentication,
    selectGroup: userAuthentication,
    createPost: groupAuthentication,
    createComment: groupAuthentication
  }
};

const middlewares = [middleware1];

module.exports = {
  middlewares
};
