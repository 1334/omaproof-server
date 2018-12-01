const jwt = require('jsonwebtoken');

const userAuthentication = (resolve, root, args, context, info) => {
  const token = args.token;
  if (!token) throw new Error('Invalid authorization');
  const { userId } = jwt.verify(token, process.env.APP_SECRET);
  context.userId = userId;
  if (!userId) throw new Error('Invalid authorization');
  return resolve(root, args, context, info);
};

const groupAuthentication = (resolve, root, args, context, info) => {
  const token = args.token;
  if (!token) throw new Error('Invalid authorization');
  const { userId, activeGroup } = jwt.verify(token, process.env.APP_SECRET);
  if (!userId || !activeGroup) throw new Error('Invalid authorization');
  context.userId = userId;
  context.activeGroup = activeGroup;
  return resolve(root, args, context, info);
};

module.exports = {
  userAuthentication,
  groupAuthentication
};
