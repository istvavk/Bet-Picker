import './init';

import { createUser } from "./callable/create-user";
import { userDocumentDelete } from "./triggers/user-document-delete";
import { getOdds } from "./callable/get-odds";
import { getCSV } from "./callable/get-csv";

export const api = {
  /**
   * Callable
   */
  createUser,
  getOdds,
  getCSV,
  /**
   * Triggers
   */
  userDocumentDelete
};
