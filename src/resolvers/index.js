const Mutation = require('./Mutation');
const UserAuthPayload = require('./UserAuthPayload');
const GroupAuthPayload = require('./GroupAuthPayload');
const Query = require('./Query');

const resolvers = {
  Query,
  Mutation,
  UserAuthPayload,
  GroupAuthPayload
};

module.exports = {
  resolvers
};
