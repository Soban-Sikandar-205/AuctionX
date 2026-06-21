// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvw4Rk8I9qNyL_e2ioPRJJpa8vEILpcoM",
  authDomain: "auctionex-204.firebaseapp.com",
  databaseURL: "https://auctionex-204-default-rtdb.firebaseio.com",
  projectId: "auctionex-204",
  storageBucket: "auctionex-204.firebasestorage.app",
  messagingSenderId: "75383948426",
  appId: "1:75383948426:web:4050abc6326ff984bf1973",
  measurementId: "G-C2FCBLNS4N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const databaseURL = firebaseConfig.databaseURL;
