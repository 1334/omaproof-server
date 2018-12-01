const jwt = require('jsonwebtoken');
const {
  verifyUserIsAdminByID,
  verifyUserIsInGroupById
} = require('../../helperfunctions/verifications');

async function selectGroup(parent, args, context) {
  const groups = await context.db.query.groups(
    {
      where: {
        id: args.id,
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
  if (!group) throw new Error('Invalid');
  const signature = { userId: context.userId, activeGroup: args.id };
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
  if (args.contactNumbers) {
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

async function deleteUserFromGroup(parent, args, context, info) {
  const isUserAdmin = verifyUserIsAdminByID(context);
  if (!isUserAdmin) throw new Error('Invalid');

  const isUserInGroup = verifyUserIsInGroupById(args.Id, context);
  if (!isUserInGroup) throw new Error('Invalid');

  return context.db.mutation.updateGroup(
    {
      where: {
        id: context.activeGroup
      },
      data: { users: { disconnect: { id: args.id } } }
    },
    info
  );
}

module.exports = { selectGroup, createGroup, deleteUserFromGroup };
