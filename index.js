const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const deleteAllUsers = (nextPageToken) => {
  let uids = [];
  admin
    .auth()
    .listUsers(100, nextPageToken)
    .then((listUsersResult) => {
      uids = uids.concat(
        listUsersResult.users.map((userRecord) => userRecord.uid)
      );
      console.log(uids);
      if (listUsersResult.pageToken) {
        deleteAllUsers(listUsersResult.pageToken);
      }
    })
    .catch((error) => {
      console.log("Error listing users:", error);
    })
    .finally(() => {
      admin.auth().deleteUsers(uids);
    });
};

deleteAllUsers();
