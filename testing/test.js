const verifications = require('../src/resolvers/helperfunctions/verifications');
let adminId;
let userId;
let activeGroup;
const context = () => {
  return {
    db: {
      query: {
        group: x => {
          return {
            admin: {
              id: adminId
            }
          };
        }
      }
    },
    userId: userId,
    activeGroup: activeGroup
  };
};

test('admin.id is equal to userId', async () => {
  expect.assertions(1);
  userId = 'test';
  adminId = 'test';
  adminId = 'test';
  await expect(verifications.verifyUserIsAdminById(context())).resolves.toBe(
    true
  );
});
