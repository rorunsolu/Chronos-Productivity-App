import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log("auth key", import.meta.env.VITE_FIREBASE_API_KEY);
console.log(import.meta.env);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const registerWithEmail = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Could not register user", error);
    }
};

const loginWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Could not login user", error);
    }
};

const loginAnonymously = async () => {
    try {
        const userCredential = await signInAnonymously(auth);
        console.log("User logged in anonymously:", userCredential.user);
    } catch (error) {
        console.error("Could not login user", error);
    }
};

const checkIfUserIsStillLoggedIn = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is signed in:", user.uid);
        } else {
            console.log("User is signed out");
        }
    });
};

const logOut = async () => {
    await signOut(auth);
};

checkIfUserIsStillLoggedIn();

export { db, auth, registerWithEmail, loginWithEmail, loginAnonymously, checkIfUserIsStillLoggedIn, logOut };