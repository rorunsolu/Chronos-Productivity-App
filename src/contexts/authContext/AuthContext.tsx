import { auth } from "@/firebase/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  //signInWithRedirect,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  // const googleSignIn = () => {
  //   const provider = new GoogleAuthProvider();
  //   const isDevelopment = process.env.NODE_ENV === "development";
  //   return isDevelopment
  //     ? signInWithPopup(auth, provider)
  //     : signInWithRedirect(auth, provider);
  // };

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const emailSignIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const emailSignUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInAsGuest = async () => {
    const credential = await signInAnonymously(auth);
    setUser(credential.user);
    setIsGuest(true);
    return credential;
  };

  const logOut = () => {
    //console.log(`Logging out... (UID: ${user?.uid})`);
    setUser(null);
    setIsGuest(false);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsGuest(currentUser?.isAnonymous || false);
      setLoading(false);
      console.log("Current user?", currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        googleSignIn,
        emailSignIn,
        emailSignUp,
        signInAsGuest,
        logOut,
        user,
        isGuest,
      }}
    >
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

interface AuthContextType {
  googleSignIn: () => Promise<UserCredential>;
  emailSignIn: (email: string, password: string) => Promise<UserCredential>;
  emailSignUp: (email: string, password: string) => Promise<UserCredential>;
  signInAsGuest: () => Promise<UserCredential>;
  logOut: () => void;
  user: User | null;
  isGuest: boolean;
}

interface AuthContextProviderProps {
  children: ReactNode;
}
