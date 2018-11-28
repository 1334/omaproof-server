const jwt = require('jsonwebtoken');

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

async function deleteUserFromGroup(parent, args, context, info) {
  const group = await context.db.query.group(
    {
      where: {
        id: context.activeGroup
      }
    },
    `{id users {id} admin {id}}`
  );
  if (
    group.users.find(user => user.id === args.id) &&
    context.userId === group.admin.id
  ) {
    return await context.db.mutation.updateGroup(
      {
        where: {
          id: context.activeGroup
        },
        data: { users: { disconnect: { id: args.id } } }
      },
      info
    );
  } else {
    throw new Error('Invalide');
  }
}

module.exports = { selectGroup, createGroup, deleteUserFromGroup };
