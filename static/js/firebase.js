// =======================================
// AI Buddy - Firebase
// Google Login + Firestore
// =======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// =======================================
// Firebase Configuration
// =======================================

const firebaseConfig = {
    apiKey: "AIzaSyDjU1cn9jWU1E9dDzTmsC8lp8BTd6CJJGM",
    authDomain: "ai-buddy-chatbot-1ff91.firebaseapp.com",
    projectId: "ai-buddy-chatbot-1ff91",
    storageBucket: "ai-buddy-chatbot-1ff91.firebasestorage.app",
    messagingSenderId: "793079446603",
    appId: "1:793079446603:web:8f215d189cdfd42813e1ce",
    measurementId: "G-GFB9QT49B5"
};


// =======================================
// Initialize Firebase
// =======================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const provider = new GoogleAuthProvider();


// =======================================
// Google Login
// =======================================

window.googleLogin = async function () {

    try {

        await signInWithPopup(auth, provider);

    } catch (error) {

        console.error("Google Login Error:", error);

        alert(error.message);

    }

};


// =======================================
// Logout
// =======================================

window.logout = async function () {

    try {

        await signOut(auth);

    } catch (error) {

        console.error("Logout Error:", error);

    }

};


// =======================================
// Current User
// =======================================

let currentUser = null;


// =======================================
// Authentication State
// =======================================

onAuthStateChanged(auth, (user) => {

    currentUser = user;

    window.currentUser = user;

    console.log("Current user:", user);

    const loginButton = document.getElementById("login-btn");

    const logoutButton = document.getElementById("logout-btn");

    const userName = document.getElementById("user-name");

    const userPhoto = document.getElementById("user-photo");


    if (user) {

        if (loginButton) {
            loginButton.style.display = "none";
        }

        if (logoutButton) {
            logoutButton.style.display = "block";
        }

        if (userName) {
            userName.innerText = user.displayName || "AI Buddy User";
        }

        if (userPhoto && user.photoURL) {
            userPhoto.src = user.photoURL;
        }

        console.log("Logged in as:", user.email);

    } else {

        if (loginButton) {
            loginButton.style.display = "block";
        }

        if (logoutButton) {
            logoutButton.style.display = "none";
        }

        if (userName) {
            userName.innerText = "";
        }

        console.log("No user logged in.");

    }

});


// =======================================
// Save Message to Firestore
// =======================================

window.saveMessageToFirestore = async function (text, sender) {

    if (!currentUser) {

        console.log("User is not logged in. Message not saved.");

        return;

    }

    try {

        await addDoc(
            collection(
                db,
                "users",
                currentUser.uid,
                "messages"
            ),
            {
                text: text,
                sender: sender,
                createdAt: serverTimestamp()
            }
        );

        console.log("Message saved to Firestore.");

    } catch (error) {

        console.error(
            "Firestore save error:",
            error
        );

    }

};


// =======================================
// Load Chat History from Firestore
// =======================================

window.loadFirestoreHistory = async function () {

    if (!currentUser) {

        console.log("User is not logged in.");

        return [];

    }

    try {

        const messagesRef = collection(
            db,
            "users",
            currentUser.uid,
            "messages"
        );

        const q = query(
            messagesRef,
            orderBy("createdAt", "asc")
        );

        const snapshot = await getDocs(q);

        const messages = [];

        snapshot.forEach((doc) => {

            const data = doc.data();

            messages.push({
                text: data.text,
                sender: data.sender
            });

        });

        console.log(
            "Firestore history:",
            messages
        );

        return messages;

    } catch (error) {

        console.error(
            "Firestore history error:",
            error
        );

        return [];

    }

};
