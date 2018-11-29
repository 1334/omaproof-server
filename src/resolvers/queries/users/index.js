async function getUsers(parent, args, context, info) {
  return context.db.query.users(
    {
      where: {
        ...args.where,
        AND: { groups_some: { id: context.activeGroup } }
      }
    },
    info
  );
}

module.exports = {
  getUsers
};
