import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

// const loginWithEmail = async (email: string, password: string) => {
//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         return userCredential.user;
//     } catch (error) {
//         console.error("Could not login user", error);
//     }
// };

const checkIfUserIsStillLoggedIn = () =>
    onAuthStateChanged(auth, user =>
        console.log(user ? `User is signed in: ${user.uid}` : "User is signed out")
    );

// const loginAnonymously = async () => {
//     try {
//         const userCredential = await signInAnonymously(auth);
//         console.log("User logged in anonymously:", userCredential.user);
//     } catch (error) {
//         console.error("Could not login user", error);
//     }
// };

checkIfUserIsStillLoggedIn();

export { app, db, auth, checkIfUserIsStillLoggedIn };