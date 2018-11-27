const jwt = require('jsonwebtoken');

const userAuthentication = (resolve, root, args, context, info) => {
  const authorization = context.request.get('Authorization');
  if (authorization) {
    const token = authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    context.userId = userId;
    if (!userId) throw new Error('Invalid authorization, is user logged in?');
  } else {
    throw new Error('Invalid authorization');
  }
  return resolve(root, args, context, info);
};

const GroupAuthentication = (resolve, root, args, context, info) => {
  const authorization = context.request.get('Authorization');
  if (authorization) {
    const token = authorization.replace('Bearer ', '');
    const { userId, activeGroup } = jwt.verify(token, process.env.APP_SECRET);
    console.log('AUTHENTICATION: ', { userId, activeGroup });
    if (!userId) throw new Error('Invalid authorization, is user logged in?');
    if (!activeGroup)
      throw new Error(
        'Invalid authentication, is user logged in and is the group selected?'
      );
    context.userId = userId;
    context.activeGroup = activeGroup;
  } else {
    throw new Error('Invalid authorization');
  }
  return resolve(root, args, context, info);
};

module.exports = {
  userAuthentication,
  GroupAuthentication
};
