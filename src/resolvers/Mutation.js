const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

async function createUser(root, args, context) {
  // auto generate password:
  args.data.password = uuidv4();
  const user = await context.db.mutation.createUser(
    {
      data: {
        ...args.data
      }
    },
    `{id}`
  );
  const token = jwt.sign(
    { userId: user.id, activeGroup: null },
    process.env.APP_SECRET
  );
  return {
    token,
    user
  };
}

async function login(root, args, context) {
  const user = await context.db.query.user(
    { where: { contactNumber: args.contactNumber } },
    `{id password}`
  );
  if (!user) throw new Error('User not found');
  // const valid = args.password === user.password;
  // if (!valid) throw new Error('Incorrect password');
  const token = jwt.sign(
    { userId: user.id, activeGroup: null },
    process.env.APP_SECRET
  );
  return {
    token,
    user
  };
}

async function selectGroup(parent, args, context) {
  const groups = await context.db.query.groups(
    {
      where: {
        id: args.groupId,
        AND: {
          users_some: {
            id: context.userId
          }
        }
      }
    },
    `{id}`
  );
  const group = groups[0];
  if (!group) throw new Error('GroupId not available for user');
  const signature = { userId: context.userId, activeGroup: args.groupId };
  const token = jwt.sign(signature, process.env.APP_SECRET);
  return {
    token,
    group
  };
}

async function createGroup(parent, args, context) {
  const newUserContactNumbers = [];
  const oldUserContactNumbers = [];
  const admin = { id: context.userId };
  for (let index = 0; index < args.contactNumbers.length; index++) {
    const number = args.contactNumbers[index];
    const user = await context.db.query.user(
      {
        where: {
          contactNumber: number
        }
      },
      `{id}`
    );
    user
      ? oldUserContactNumbers.push({ contactNumber: number })
      : newUserContactNumbers.push({ contactNumber: number });
  }

  const group = await context.db.mutation.createGroup(
    {
      data: {
        ...args.data,
        admin: {
          connect: admin
        },
        users: {
          connect: [admin, ...oldUserContactNumbers],
          create: [...newUserContactNumbers]
        }
      }
    },
    `{id}`
  );
  const signature = {
    userId: context.userId,
    activeGroup: group.id
  };
  const token = jwt.sign(signature, process.env.APP_SECRET);
  return {
    token,
    group
  };
}

// Access verification: it is either the user itself or the admin
async function updateUser(parent, args, context, info) {
  const isUserSelf = context.userId === args.userId;
  const isValidUser = await _verifyUserIsInGroupById(args.userId, context);
  if (!isValidUser) throw new Error('Invalid authorization');
  const isAdmin = await _verifyUserIsAdminById(context);
  if (!isUserSelf && !isAdmin) throw new Error('Invalid authorization');
  return context.db.mutation.updateUser(
    {
      data: {
        ...args.data
      },
      where: {
        id: args.userId
      }
    },
    info
  );
}

async function _verifyUserIsAdminById(context) {
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

async function _verifyUserIsInGroupById(userId, context) {
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

async function _verifyUserIdByContactNumbers(contactNumbers, context) {
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

async function _verifyPostId(postId, context) {
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

async function createComment(parent, args, context, info) {
  if (!(await _verifyPostId(args.postId, context)))
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
  const verifiedIds = await _verifyUserIdByContactNumbers(
    tags_contactNumbers,
    context
  );
  const arr = verifiedIds.map(el => {
    return { user: { connect: { contactNumber: el.contactNumber } } };
  });
  return { create: arr };
}

module.exports = {
  createUser,
  login,
  createGroup,
  selectGroup,
  createPost,
  createComment,
  updateUser
};
