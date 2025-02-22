import { useContext, createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { AuthContextProviderProps, AuthContextType } from '../../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        const isDevelopment = process.env.NODE_ENV === 'development';
        return isDevelopment ? signInWithPopup(auth, provider) : signInWithRedirect(auth, provider);
    };

    const emailSignIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const emailSignUp = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            console.log("Current user i think?", currentUser);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ googleSignIn, emailSignIn, emailSignUp, logOut, user }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const UserAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};