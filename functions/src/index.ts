import * as admin from "firebase-admin";
import {createUser} from "./callable/create-user";
import {userDocumentDelete} from "./triggers/user-document-delete";

admin.initializeApp();

export const api = {
  /**
   * Callable
   */
  createUser,
  /**
   * Triggers
   */
  userDocumentDelete
};