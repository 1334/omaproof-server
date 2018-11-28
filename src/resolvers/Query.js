async function getGroups(parent, args, context, info) {
  return await context.db.query.groups(
    {
      where: { ...args.where, AND: { users_some: { id: context.userId } } }
    },
    info
  );
}

async function getUsers(parent, args, context, info) {
  return await context.db.query.users(
    {
      where: {
        ...args.where,
        AND: { groups_some: { id: context.activeGroup } }
      }
    },
    info
  );
}

async function getPosts(parent, args, context, info) {
  return await context.db.query.posts(
    {
      where: { ...args.where, AND: { group: { id: context.activeGroup } } }
    },
    info
  );
}

async function getComments(parent, args, context, info) {
  return await context.db.query.comments(
    {
      where: {
        ...args.where,
        AND: { post: { group: { id: context.activeGroup } } }
      }
    },
    info
  );
}

async function getTagsForPosts(parent, args, context, info) {
  return await context.db.query.tags(
    {
      where: {
        ...args.where,
        AND: {
          link_post: { group: { id: context.activeGroup } }
        }
      }
    },
    info
  );
}

async function getTagsForComments(parent, args, context, info) {
  return await context.db.query.tags(
    {
      where: {
        ...args.where,
        AND: {
          link_comment: { post: { group: { id: context.activeGroup } } }
        }
      }
    },
    info
  );
}

module.exports = {
  getGroups,
  getUsers,
  getPosts,
  getComments,
  getTagsForPosts,
  getTagsForComments
};
