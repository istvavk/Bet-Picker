import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export const userDocumentDelete = functions
  .region('us-central1')
  .firestore
  .document(`users/{documentId}`)
  .onDelete(async (snap, context) => {
    const user = snap.data();
    const uid = context.params.documentId;

    if (!user) {
      return;
    }

    try {
      await admin.auth().deleteUser(uid);
    } catch (e) {
      functions.logger.error(e);
    }
  });
