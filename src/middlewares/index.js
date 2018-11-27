const {
  userAuthentication,
  GroupAuthentication
} = require('./authentication/');

const middleware1 = {
  Mutation: {
    createGroup: userAuthentication,
    createPost: GroupAuthentication,
    createTag: GroupAuthentication,
    createComment: GroupAuthentication
  }
};

const middlewares = [middleware1];

module.exports = {
  middlewares
};
