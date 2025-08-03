import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyA8UrFOFZn3BHJECvUhNN6RPzamZXJRA2I",

  authDomain: "guru-chanra.firebaseapp.com",

  projectId: "guru-chanra",

  storageBucket: "guru-chanra.firebasestorage.app",

  messagingSenderId: "925933950907",

  appId: "1:925933950907:web:7c497d86afac6d051b169e",

  measurementId: "G-6MQNCNQVMR",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
