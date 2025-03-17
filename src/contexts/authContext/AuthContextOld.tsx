import { auth } from '../../firebase/firebase';
import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
    } from 'react';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    signOut,
    User,
    Auth
    } from 'firebase/auth';

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }: { children: ReactNode; }) => {
    const [user, setUser] = useState<User | null>(null);

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        const isDevelopment = process.env.NODE_ENV === 'development';
        return isDevelopment ? signInWithPopup(auth, provider) : signInWithRedirect(auth, provider);
    };

    const emailSignIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const emailSignUp = (auth: Auth, email: string, password: string) => {
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