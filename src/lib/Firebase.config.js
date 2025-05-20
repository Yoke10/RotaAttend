// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGRS5nxC0h-L2CcxKaxxsPXW_5vUqTxkU",
  authDomain: "rotaattend.firebaseapp.com",
  projectId: "rotaattend",
  storageBucket: "rotaattend.firebasestorage.app",
  messagingSenderId: "181888146870",
  appId: "1:181888146870:web:70ef60a852197470e47517",
  measurementId: "G-1XNT8S0QC1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
