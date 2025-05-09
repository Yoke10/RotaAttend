// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCd4l8l1J0aC_HYXaicgyI06yGiHz42NBM",
  authDomain: "tests-a3d4f.firebaseapp.com",
  databaseURL: "https://tests-a3d4f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tests-a3d4f",
  storageBucket: "tests-a3d4f.firebasestorage.app",
  messagingSenderId: "59997525661",
  appId: "1:59997525661:web:833d64fe9a7df6bfdaa674",
  measurementId: "G-2E7EFKJHZH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();