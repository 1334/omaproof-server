const {
  verifyPostId,
  verifyUserIdByContactNumbers
} = require('../../helperfunctions/verifications');

async function createPost(parent, args, context, info) {
  const options = {};
  options.group = { connect: { id: context.activeGroup } };
  options.user = { connect: { id: context.userId } };
  if (args.tags_contactNumbers) {
    options.tags = await _createTags(args.tags_contactNumbers, context);
  }
  return context.db.mutation.createPost(
    {
      data: {
        ...args.content,
        ...options
      }
    },
    info
  );
}

async function createComment(parent, args, context, info) {
  if (!(await verifyPostId(args.postId, context)))
    throw new Error('Invalid post id');
  const options = {};
  options.post = { connect: { id: args.postId } };
  options.user = { connect: { id: context.userId } };
  if (args.tags_contactNumbers) {
    options.tags = await _createTags(args.tags_contactNumbers, context);
  }
  return context.db.mutation.createComment(
    {
      data: {
        ...args.content,
        ...options
      }
    },
    info
  );
}

async function _createTags(tags_contactNumbers, context) {
  const verifiedIds = await verifyUserIdByContactNumbers(
    tags_contactNumbers,
    context
  );
  const arr = verifiedIds.map(el => {
    return { user: { connect: { contactNumber: el.contactNumber } } };
  });
  return { create: arr };
}

async function deletePost(parent, args, context, info) {
  const post = await context.db.query.post(
    {
      where: {
        id: args.id
      }
    },
    `{
      id
      group 
        {id}
      user 
        {id}
    }`
  );

  if (context.userId !== post.user.id || context.activeGroup !== post.group.id)
    throw new Error('Invalid');

  return await context.db.mutation.deletePost(
    {
      where: {
        id: args.id
      }
    },
    info
  );
}

async function deleteComment(parent, args, context, info) {
  const comment = await context.db.query.comment(
    {
      where: {
        id: args.id
      }
    },
    `{
      id
      post {
        group 
          {id}
      }
      user 
        {id}
    }`
  );
  if (
    context.userId !== comment.user.id ||
    context.activeGroup !== comment.post.group.id
  ) {
    throw new Error('Invalide');
  } else {
    return await context.db.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  }
}

async function deleteTag(parent, args, context, info) {
  const tag = await context.db.query.tag(
    {
      where: {
        id: args.id
      }
    },
    `{
      id 
      link_post {id group {id} user {id}} 
      link_comment {id post {group {id}} user {id}} 
    }`
  );
  if (
    (tag.link_post &&
      (tag.link_post.user.id === context.userId &&
        tag.link_post.group.id === context.activeGroup)) ||
    (tag.link_comment &&
      (tag.link_comment.user.id === context.userId &&
        tag.link_comment.post.group.id === context.activeGroup))
  ) {
    return await context.db.mutation.deleteTag(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  } else {
    throw new Error('Invalide');
  }
}

module.exports = {
  createPost,
  createComment,
  deletePost,
  deleteComment,
  deleteTag
};
