// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCqTqvna4GEYri_EFj2079Swsl7fdNpnSY",
    authDomain: "a2dt-f5fb7.firebaseapp.com",
    projectId: "a2dt-f5fb7",
    storageBucket: "a2dt-f5fb7.firebasestorage.app",
    messagingSenderId: "576473877537",
    appId: "1:576473877537:web:0b411eda21051d62b7e760",
    measurementId: "G-PG1CMC2ERP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Google Auth Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
