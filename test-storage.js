/* eslint-env node */
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

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

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function test() {
  try {
    console.log("Creating dummy file buffer...");
    const buffer = Buffer.from("hello world");
    const storageRef = ref(storage, `images/test-dummy-${Date.now()}.txt`);
    
    console.log("Uploading dummy file to Storage...");
    const snapshot = await uploadBytes(storageRef, buffer, { contentType: "text/plain" });
    console.log("Upload succeeded! Path:", snapshot.ref.fullPath);
  } catch (error) {
    console.error("Upload failed with code:", error.code);
    console.error("Message:", error.message);
  }
}

test();
