// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3tK_gl3vnllmmOxez_SZwGW4B2mOWYNU",
  authDomain: "lab7-yucheng-ding.firebaseapp.com",
  projectId: "lab7-yucheng-ding",
  storageBucket: "lab7-yucheng-ding.firebasestorage.app",
  messagingSenderId: "572767074871",
  appId: "1:572767074871:web:828f08b27bb89426bc9db2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
