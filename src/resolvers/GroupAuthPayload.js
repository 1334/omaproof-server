function group(root, args, context, info) {
  return context.db.query.group({ where: { id: root.group.id } }, info);
}

module.exports = {
  group
};
