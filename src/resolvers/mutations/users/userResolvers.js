const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const {
  verifyUserIsAdminById,
  verifyUserIsInGroupById
} = require('./helperfunctions/verifications');

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

// Access verification: it is either the user itself or the admin
async function updateUser(parent, args, context, info) {
  const isUserSelf = context.userId === args.userId;
  const isValidUser = await verifyUserIsInGroupById(args.userId, context);
  if (!isValidUser) throw new Error('Invalid authorization');
  const isAdmin = await verifyUserIsAdminById(context);
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

async function deleteUser(parent, args, context, info) {
  if (args.id === context.userId) {
    return await context.db.mutation.deleteUser(
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

module.exports = { createUser, login, updateUser, deleteUser };
