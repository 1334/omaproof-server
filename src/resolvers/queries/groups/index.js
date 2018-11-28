async function getGroups(parent, args, context, info) {
  return context.db.query.groups(
    {
      where: { ...args.where, AND: { users_some: { id: context.userId } } }
    },
    info
  );
}

module.exports = {
  getGroups
};
