// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAI-dkRPdFRfmjTa6JiATnnBJZG5CTwd6k",
  authDomain: "sodium-elf-419523.firebaseapp.com",
  projectId: "sodium-elf-419523",
  storageBucket: "sodium-elf-419523.appspot.com",
  messagingSenderId: "29946781788",
  appId: "1:29946781788:web:30d6fe382c8538d9ed4699",
  measurementId: "G-F69SFMENCP"
};

const app = initializeApp(firebaseConfig);
const firebase_auth = getAuth(app);
export default firebase_auth;