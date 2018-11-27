const {
  userAuthentication,
  GroupAuthentication
} = require('./authentication/');

const middleware1 = {
  Mutation: {
    createGroup: userAuthentication,
    selectGroup: userAuthentication,
    createPost: GroupAuthentication,
    createComment: GroupAuthentication
  }
};

const middlewares = [middleware1];

module.exports = {
  middlewares
};
