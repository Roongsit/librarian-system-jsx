// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqDIYwj85O3nxmdx-mGACtpIVQ9t-dsW0",
  authDomain: "react-firebase-auth-5870a.firebaseapp.com",
  projectId: "react-firebase-auth-5870a",
  storageBucket: "react-firebase-auth-5870a.appspot.com",
  messagingSenderId: "760905095666",
  appId: "1:760905095666:web:4f8239bf621d44742fb36b",
  measurementId: "G-T5N0409G6K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storageRef = getStorage(app);
export default app;
