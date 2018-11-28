const {
  verifyPostId,
  verifyTagId,
  verifyUserIdByContactNumbers,
  verifyCommentId
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
  if (!(await verifyPostId(context, args.postId)))
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
  if (!(await verifyPostId(context, args.id, true))) throw new Error('Invalid');
  return context.db.mutation.deletePost(
    {
      where: {
        id: args.id
      }
    },
    info
  );
}

async function deleteComment(parent, args, context, info) {
  if (!(await verifyCommentId(context, args.id, true)))
    throw new Error('Invalid');
  return context.db.mutation.deleteComment(
    {
      where: {
        id: args.id
      }
    },
    info
  );
}

async function deleteTag(parent, args, context, info) {
  if (!(await verifyTagId(context, args.id, true))) throw new Error('Invalid');
  return context.db.mutation.deleteTag(
    {
      where: {
        id: args.id
      }
    },
    info
  );
}

module.exports = {
  createPost,
  createComment,
  deletePost,
  deleteComment,
  deleteTag
};
