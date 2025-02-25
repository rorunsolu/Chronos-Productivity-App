import { ReactNode } from 'react';
import { User, UserCredential } from "firebase/auth";
import { taskData } from "../features/Tasks/context/TaskContext";
import { noteData } from "../features/Notes/context/NoteContext";
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

export interface taskPageSectionProps {
    title: string;
    tasks: taskData[];
    completionToggle: (task: taskData) => void;
    deleteTask: (id: string) => void;
}

export interface taskProps {
    task: taskData;
    completionToggle: (task: taskData) => void;
    deleteTask: (id: string) => void;
}

export interface notePageSectionProps {
    notes: noteData[];
    deleteNote: (id: string) => void;
}

export interface noteProps {
    note: noteData;
    deleteNote: (id: string) => void;
    // updateNote: (id: string, title: string, content: string) => void;
}