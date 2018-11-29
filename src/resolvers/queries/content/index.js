async function getPosts(parent, args, context, info) {
  return context.db.query.posts(
    {
      where: { ...args.where, AND: { group: { id: context.activeGroup } } },
      orderBy: args.orderBy
    },
    info
  );
}

async function getComments(parent, args, context, info) {
  return context.db.query.comments(
    {
      where: {
        ...args.where,
        AND: { post: { group: { id: context.activeGroup } } }
      },
      orderBy: args.orderBy
    },
    info
  );
}

async function getTagsForPosts(parent, args, context, info) {
  return context.db.query.tags(
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
  return context.db.query.tags(
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
  getComments,
  getPosts,
  getTagsForComments,
  getTagsForPosts
};
