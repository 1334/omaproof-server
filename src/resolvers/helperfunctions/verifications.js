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
 * Check that the postId is part of the active group
 * @param {*} postId postId to be checked
 * @param {*} context graphql context object (also contains authentication activegroup and userId)
 */
async function verifyPostId(postId, context) {
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
      `{id}`
    );
    return !!posts[0];
  } catch (error) {
    throw new Error('Invalid post id');
  }
}

module.exports = {
  verifyPostId,
  verifyUserIdByContactNumbers,
  verifyUserIsAdminById,
  verifyUserIsInGroupById
};
