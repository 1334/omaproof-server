const verifications = require('../src/resolvers/helperfunctions/verifications');
const context = d => {
  return {
    db: {
      query: {
        group: x => {
          return {
            admin: {
              id: testVals.adminId
            }
          };
        },
        user: x => {
          if (d === 'returnNoUser') {
            return null;
          }
          return {
            groups: [{ id: testVals.groupId }]
          };
        },
        posts: x => {
          if (d === 'returnNoPost') {
            return null;
          }
          return [
            {
              id: testVals.returnedPostId,
              user: { id: testVals.returnedUserId }
            }
          ];
        },
        comments: x => {
          if (d === 'returnNoComment') {
            return null;
          }
          return [
            {
              id: testVals.returnedCommentId,
              user: { id: testVals.returnedUserId }
            }
          ];
        }
      }
    },
    userId: testVals.userId,
    activeGroup: testVals.activeGroup
  };
};

const testVals = {
  adminId: undefined,
  userId: undefined,
  activeGroup: undefined,
  groupId: undefined,
  returnedPostId: undefined,
  returnedUserId: undefined,
  requestedPostId: undefined
};

function zeroOutTestVals() {
  for (let key in testVals) {
    testVals[key] = undefined;
  }
}

beforeEach(() => {
  zeroOutTestVals();
});

describe('verify user is admin', () => {
  test('admin.id is equal to userId', async () => {
    expect.assertions(1);
    testVals.userId = 'test';
    testVals.adminId = 'test';
    await expect(verifications.verifyUserIsAdminById(context())).resolves.toBe(
      true
    );
  });
  test('admin.id is not equal to userId', async () => {
    expect.assertions(1);
    testVals.userId = 'test';
    testVals.adminId = 'test2';
    await expect(verifications.verifyUserIsAdminById(context())).resolves.toBe(
      false
    );
  });
});

describe('verify user is in the active group', () => {
  test('group.id is equal to id of activeGroup', async () => {
    expect.assertions(1);
    testVals.userId = 'testUser';
    testVals.groupId = 'test';
    testVals.activeGroup = 'test';
    await expect(
      verifications.verifyUserIsInGroupById(testVals.userId, context())
    ).resolves.toBeTruthy();
  });

  test('group.id is not equal to activeGroupId', async () => {
    expect.assertions(1);
    testVals.userId = 'testUser';
    testVals.groupId = 'test2';
    testVals.activeGroup = 'test';
    await expect(
      verifications.verifyUserIsInGroupById(testVals.userId, context())
    ).resolves.toBeFalsy();
  });

  test('userId is falsy throw Error Invalid', async () => {
    // expect.assertions(1);
    testVals.groupId = 'test';
    testVals.activeGroup = 'test';
    await expect(
      verifications.verifyUserIsInGroupById(
        testVals.userId,
        context('returnNoUser')
      )
    ).rejects.toThrow(/Invalid/);
  });
});

describe('verify post refers to the activeGroup', () => {
  test('should throw error when no posts returned from request', async () => {
    expect.assertions(1);
    await expect(
      verifications.verifyPostId(context('returnNoPost'))
    ).rejects.toThrow(/Invalid/);
  });

  test('should return true if posts returned and when not checking for user', async () => {
    expect.assertions(1);
    testVals.returnedPostId = 'testPost';
    testVals.returnedUserId = 'testUser';
    testVals.requestedPostId = 'testRequestedPost';
    await expect(
      verifications.verifyPostId(context(), testVals.requestedPostId, false)
    ).resolves.toBeTruthy();
  });

  test('should return true if posts returned, checking for userId and it matches user id of the post', async () => {
    expect.assertions(1);
    testVals.returnedPostId = 'testPost';
    testVals.returnedUserId = 'testUser';
    testVals.requestedPostId = 'testRequestedPost';
    testVals.userId = 'testUser';
    await expect(
      verifications.verifyPostId(context(), testVals.requestedPostId, true)
    ).resolves.toBeTruthy();
  });

  test('should return false if posts returned, checking for userId and it does not match user id of the post', async () => {
    expect.assertions(1);
    testVals.returnedPostId = 'testPost';
    testVals.returnedUserId = 'returnedUser';
    testVals.requestedPostId = 'testRequestedPost';
    testVals.userId = 'activeUser';
    await expect(
      verifications.verifyPostId(context(), testVals.requestedPostId, true)
    ).resolves.toBeFalsy();
  });
});

describe('verify comment refers to the activeGroup', () => {
  test('should throw error when no posts returned from request', async () => {
    expect.assertions(1);
    await expect(
      verifications.verifyPostId(context('returnNoPost'))
    ).rejects.toThrow(/Invalid/);
  });

  test('should return true if posts returned and when not checking for user', async () => {
    expect.assertions(1);
    testVals.returnedPostId = 'testPost';
    testVals.returnedUserId = 'testUser';
    testVals.requestedPostId = 'testRequestedPost';
    await expect(
      verifications.verifyPostId(context(), testVals.requestedPostId, false)
    ).resolves.toBeTruthy();
  });

  test('should return true if posts returned, checking for userId and it matches user id of the post', async () => {
    expect.assertions(1);
    testVals.returnedPostId = 'testPost';
    testVals.returnedUserId = 'testUser';
    testVals.requestedPostId = 'testRequestedPost';
    testVals.userId = 'testUser';
    await expect(
      verifications.verifyPostId(context(), testVals.requestedPostId, true)
    ).resolves.toBeTruthy();
  });

  test('should return false if posts returned, checking for userId and it does not match user id of the post', async () => {
    expect.assertions(1);
    testVals.returnedPostId = 'testPost';
    testVals.returnedUserId = 'returnedUser';
    testVals.requestedPostId = 'testRequestedPost';
    testVals.userId = 'activeUser';
    await expect(
      verifications.verifyPostId(context(), testVals.requestedPostId, true)
    ).resolves.toBeFalsy();
  });
});
