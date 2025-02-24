// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAuVfosifu6oB6cO7bn8QFoVxEnq7DCmbo",
    authDomain: "project-669-793b1.firebaseapp.com",
    projectId: "project-669-793b1",
    storageBucket: "project-669-793b1.appspot.com",
    messagingSenderId: "322884994586",
    appId: "1:322884994586:web:46529a56359940c0fcf3a3",
    measurementId: "G-66QZDLXDQN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
