import { ReactNode } from 'react';
import { User, UserCredential } from "firebase/auth";
export interface AuthContextProviderProps {
    children: ReactNode;
}

export interface AuthContextType {
    googleSignIn: () => Promise<UserCredential>;
    emailSignIn: (email: string, password: string) => Promise<UserCredential>;
    emailSignUp: (email: string, password: string) => Promise<UserCredential>;
    logOut: () => void;
    user: User | null;
}