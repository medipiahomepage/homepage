import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "medipiahomepage",
  appId: "1:1029893065973:web:956a3d2a5698b4253789bc",
  storageBucket: "medipiahomepage.firebasestorage.app",
  apiKey: "AIzaSyArxkGeSKXlch1IEfo657KRz4bfLwo9VvI",
  authDomain: "medipiahomepage.firebaseapp.com",
  messagingSenderId: "1029893065973",
  measurementId: "G-Z5CKQGGR6S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
