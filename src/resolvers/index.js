const Mutation = require('./Mutation');
const UserAuthPayload = require('./UserAuthPayload');
const GroupAuthPayload = require('./GroupAuthPayload');

const resolvers = {
  Mutation,
  UserAuthPayload,
  GroupAuthPayload
};

module.exports = {
  resolvers
};
