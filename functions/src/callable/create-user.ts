import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export const createUser = functions
  .region("us-central1")
  .https
  .onCall(async (data) => {
    const {email, password} = data;

    if ([email, password].some((value) => !value)) {
      throw new functions.https.HttpsError("invalid-argument", "Missing required fields");
    }

    let user: admin.auth.UserRecord;

    try {
      /*
       * Create user in Firebase Authentication service
       */
      user = await admin.auth().createUser(data);

      /*
        * Set custom claims for rules purposes on user
       */
      await admin.auth().setCustomUserClaims(user.uid, {
        role: "admin"
      });

      /*
       * Create user in Firestore database
       */
      await admin.firestore().collection("users").doc(user.uid).set({
        createdOn: Date.now(),
        email
      });
    } catch (error) {
      functions.logger.error(error);
      throw new functions.https.HttpsError("internal", (error as any).toString());
    }

    return {
      id: user.uid
    };
  });