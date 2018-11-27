async function getGroups(parent, args, context, info) {
  return await context.db.query.groups(
    {
      where: args.where
    },
    info
  );
}

async function getUsers(parent, args, context, info) {
  return await context.db.query.users(
    {
      where: args.where
    },
    info
  );
}

async function getPosts(parent, args, context, info) {
  return await context.db.query.posts(
    {
      where: args.where
    },
    info
  );
}

async function getComments(parent, args, context, info) {
  return await context.db.query.comments(
    {
      where: args.where
    },
    info
  );
}

async function getTags(parent, args, context, info) {
  return await context.db.query.tags(
    {
      where: args.where
    },
    info
  );
}

module.exports = {
  getGroups,
  getUsers,
  getPosts,
  getComments,
  getTags
};
