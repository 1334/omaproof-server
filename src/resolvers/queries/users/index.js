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

async function grandParentLogin(parent, args, context) {
  const { sessionToken, question } = context.rabbitResponse;
  const { options, type } = question;
  console.log('heeey: ', context.rabbitResponse);
  if (type === 'success') {
    console.log('YIPPIEE');
  }
  return {
    token: sessionToken,
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
