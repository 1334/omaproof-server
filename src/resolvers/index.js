const Mutation = require('./mutations');
const UserAuthPayload = require('./authentication/UserAuthPayload');
const GroupAuthPayload = require('./authentication/GroupAuthPayload');
const Query = require('./queries');

const resolvers = {
  Query,
  Mutation,
  UserAuthPayload,
  GroupAuthPayload
};

module.exports = {
  resolvers
};
