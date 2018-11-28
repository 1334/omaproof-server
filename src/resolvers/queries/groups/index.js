async function getGroups(parent, args, context, info) {
  return await context.db.query.groups(
    {
      where: { ...args.where, AND: { users_some: { id: context.userId } } }
    },
    info
  );
}

module.exports = {
  getGroups
};
