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

async function grandParentLogin(parent, args, context, info) {
  const { token, question } = context.rabbitResponse;
  const { options, type } = question;
  console.log(options, type, token);
  return {
    token,
    question: {
      options,
      type
    }
  };
}

module.exports = {
  getUsers,
  grandParentLogin
};
