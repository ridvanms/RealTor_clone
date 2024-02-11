// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDO8lB458L6ssLMzChHg1Gagxa5TEFO9_4",
  authDomain: "realtor-clonepractice.firebaseapp.com",
  databaseURL: "https://realtor-clonepractice-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "realtor-clonepractice",
  storageBucket: "realtor-clonepractice.appspot.com",
  messagingSenderId: "568891425763",
  appId: "1:568891425763:web:d37574c28d90eb546d96d6"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();