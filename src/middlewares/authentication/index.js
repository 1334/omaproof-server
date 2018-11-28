const jwt = require('jsonwebtoken');

const userAuthentication = (resolve, root, args, context, info) => {
  const authorization = context.request.get('Authorization');
  if (!authorization) throw new Error('Invalid authorization');

  const token = authorization.replace('Bearer ', '');
  const { userId } = jwt.verify(token, process.env.APP_SECRET);
  context.userId = userId;
  if (!userId) throw new Error('Invalid authorization');
  return resolve(root, args, context, info);
};

const groupAuthentication = (resolve, root, args, context, info) => {
  const authorization = context.request.get('Authorization');
  if (!authorization) throw new Error('Invalid authorization');

  const token = authorization.replace('Bearer ', '');
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
