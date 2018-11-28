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

module.exports = {
  verifyPostId,
  verifyUserIdByContactNumbers,
  verifyUserIsAdminById,
  verifyUserIsInGroupById
};
