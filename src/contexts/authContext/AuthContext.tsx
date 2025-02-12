import { useContext, createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";

const AuthContext = createContext({});
export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        const isDevelopment = process.env.NODE_ENV === 'development';
        return isDevelopment ? signInWithPopup(auth, provider) : signInWithRedirect(auth, provider);
    };

    const emailSignIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const emailSignUp = (auth, email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log("Curent user", currentUser);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ googleSignIn, emailSignIn, emailSignUp, logOut, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};