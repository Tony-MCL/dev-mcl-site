import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBA9QCYJQ6cGvUgMb2MSYJoSEEID35_Yb0",
  authDomain: "mcl-website-8fcca.firebaseapp.com",
  projectId: "mcl-website-8fcca",
  storageBucket: "mcl-website-8fcca.firebasestorage.app",
  messagingSenderId: "277959935321",
  appId: "1:277959935321:web:975bb2c236a72f8598f848",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);