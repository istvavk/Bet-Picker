import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions';

import {environment} from "$lib/environment";
import {browser, dev} from "$app/environment";
import {authUser} from "$lib/state";

export const firebase = initializeApp(environment.firebase);
export const firebaseAuth = getAuth(firebase);
export const firebaseFirestore = getFirestore(firebase);
export const firebaseFunctions = getFunctions(firebase, 'us-central1');

if (dev) {
  connectFunctionsEmulator(firebaseFunctions, '127.0.0.1', 5001);
}

export class Auth {
  async signOut() {
    await firebaseAuth.signOut();

    window.location.href = '/';
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    await setPersistence(firebaseAuth, browserLocalPersistence);
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  }

  async sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(firebaseAuth, email);
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await setPersistence(firebaseAuth, browserLocalPersistence);
    return signInWithPopup(firebaseAuth, provider);
  }

  get currentUser() {
    return firebaseAuth.currentUser;
  }
}

export class Firestore {
  firestore: Firestore;

  constructor(firestore: Firestore) {
    this.firestore = firestore;
  }

  async addDocument(path: string, data: any) {
    const snap = await addDoc(collection(this.firestore, path), data);
    return snap.id;
  }

  async getDocument<T = any>(path: string): Promise<T> {
    const snap = await getDoc(doc(this.firestore, path));

    if (!snap.exists()) {
      // @ts-ignore
      return null;
    }

    return {
      ...snap.data(),
      id: snap.id
    } as T;
  }

  updateDocument(path: string, data: any) {
    return updateDoc(doc(this.firestore, path), data);
  }

  setDocument(path: string, data: any, merge = true) {
    return setDoc(doc(this.firestore, path), data, {
      merge
    });
  }

  async getDocumentsWithFilters<T = any>(path: string, filters: any[] = []): Promise<T[]> {
    const q = query(
      collection(this.firestore, path),
      ...filters.map((filter) => {
        return where(filter.field, filter.operator, filter.value);
      })
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      return [];
    }

    // @ts-ignore
    return snap.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id
      } as T;
    });
  }

  async deleteDocument(path: string) {
    return deleteDoc(doc(this.firestore, path));
  }
}

class Functions {
  async call(name: string, data: any) {
    const callable = httpsCallable(firebaseFunctions, name);

    return new Promise((resolve, reject) => {
      callable(data)
        .then(resolve)
        .catch(reject);
    });
  }
}

export const auth = new Auth();
export const firestore = new Firestore(firebaseFirestore);
export const functions = new Functions();

if (browser) {
  onAuthStateChanged(firebaseAuth, (user) => {
    authUser.set(user);
  });
}