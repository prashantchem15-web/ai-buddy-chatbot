// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDjU1cn9jWU1E9dDzTmsC8lp8BTd6CJJGM",
  authDomain: "ai-buddy-chatbot-1ff91.firebaseapp.com",
  projectId: "ai-buddy-chatbot-1ff91",
  storageBucket: "ai-buddy-chatbot-1ff91.firebasestorage.app",
  messagingSenderId: "793079446603",
  appId: "1:793079446603:web:8f215d189cdfd42813e1ce",
  measurementId: "G-GFB9QT49B5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Google Sign In
window.googleLogin = async function () {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

// Logout
window.logout = async function () {
  await signOut(auth);
};

// Detect Login
onAuthStateChanged(auth, (user) => {

  if (user) {

    document.getElementById("login-btn").style.display = "none";
    document.getElementById("logout-btn").style.display = "block";

    document.getElementById("user-name").innerText = user.displayName;
    document.getElementById("user-photo").src = user.photoURL;

  } else {

    document.getElementById("login-btn").style.display = "block";
    document.getElementById("logout-btn").style.display = "none";

  }

});
