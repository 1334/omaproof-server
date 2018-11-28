/**
 * Verify that the user is the admin of the active group
 * @param {*} context graphql context object (also contains authentication activegroup and userId)
 */

async function verifyUserIsAdminById(context) {
  const group = await context.db.query.group(
    {
      where: {
        id: context.activeGroup
      }
    },
    `{admin {id}}`
  );

  return group.admin.id === context.userId;
}

/**
 * Check if the userId is part of the active group
 * @param {*} userId userId which needs to be checked
 * @param {*} context graphql context object (also contains authentication activegroup and userId)
 */
async function verifyUserIsInGroupById(userId, context) {
  const user = await context.db.query.user(
    {
      where: {
        id: userId
      }
    },
    `{id groups {id}}`
  );
  if (!user) throw new Error('Invalid');
  return user.groups.find(group => group.id === context.activeGroup);
}

/**
 * Check if the contact numbers are part of the active group
 * @param {*} contactNumbers numbers that need to be checked
 * @param {*} context graphql context object (also contains authentication activegroup and userId)
 */
async function verifyUserIdByContactNumbers(contactNumbers, context) {
  return context.db.query.users(
    {
      where: {
        groups_some: {
          id: context.activeGroup
        },
        AND: {
          contactNumber_in: contactNumbers
        }
      }
    },
    `{contactNumber}`
  );
}

/**
 * Check that the postId is part of the active group (and) that the post is from the user
 * @param {*} postId postId to be checked
 * @param {*} context graphql context object (also contains authentication activegroup and userId)
 * @param {*} checkUserId boolean to check or not if user owns post
 */
async function verifyPostId(context, postId, checkUserId = false) {
  try {
    const posts = await context.db.query.posts(
      {
        where: {
          id: postId,
          AND: {
            group: {
              id: context.activeGroup
            }
          }
        }
      },
      `{id user {id}}`
    );
    if (!posts[0]) return false;
    return checkUserId ? context.userId === posts[0].user.id : true;
  } catch (error) {
    throw new Error('Invalid');
  }
}

async function verifyCommentId(context, commentId, checkUserId = false) {
  try {
    const comments = await context.db.query.comments(
      {
        where: {
          id: commentId,
          AND: {
            group: {
              id: context.activeGroup
            }
          }
        }
      },
      `{id user {id}}`
    );
    if (!comments[0]) return false;
    return checkUserId ? context.userId === comments[0].user.id : true;
  } catch (error) {
    throw new Error('Invalid');
  }
}

async function verifyTagId(context, tagId, checkUserId = false) {
  const tag = await context.db.query.tag(
    {
      where: {
        id: tagId
      }
    },
    `{
      id 
      link_post {id group {id} user {id}} 
      link_comment {id post {group {id}} user {id}} 
    }`
  );
  if (!tag) return false;
  if (tag.link_post) {
    if (!(tag.link_post.group.id === context.activeGroup)) return false;
    return checkUserId ? context.userId === tag.link_post.user.id : true;
  } else {
    if (!(tag.link_comment.post.group.id === context.activeGroup)) return false;
    return checkUserId ? context.userId === tag.link_comment.user.id : true;
  }
}

module.exports = {
  verifyPostId,
  verifyCommentId,
  verifyTagId,
  verifyUserIdByContactNumbers,
  verifyUserIsAdminById,
  verifyUserIsInGroupById
};
