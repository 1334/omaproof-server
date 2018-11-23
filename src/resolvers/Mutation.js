async function createUser(parent, args, context, info) {
  const { signUpAuthentication, metaData } = args.data;
  const user = await context.db.mutation.createUser(
    {
      data: {
        metaData: {
          create: {
            ...metaData
          }
        },
        authData: {
          create: {
            ...signUpAuthentication
          }
        }
      }
    },
    info
  );

  return user;
}

module.exports = {
  createUser
};
