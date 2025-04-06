import { createContext, useContext, useState, ReactNode } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp, query, where } from "firebase/firestore";
import { db, auth } from "@/firebase/firebase";
import { useEffect } from "react";

export interface NoteData {
    id: string;
    content: string;
    folder?: string;
    label?: string;
    createdAt: Timestamp;
    userId?: string;
}

interface NotesContextType {
    notes: NoteData[];
    fetchNotes: () => void;
    deleteNote: (id: string) => void;
    createNote: (content: string, folder?: string, label?: string, userId?: string) => Promise<string>;
}

const NoteContext = createContext<NotesContextType | undefined>(undefined);

export const UseNotes = () => {
    const context = useContext(NoteContext);
    if (!context) {
        throw new Error("UseNotes must be used within a NotesProvider");
    }
    return context;
};

export const NoteProvider = ({ children }: { children: ReactNode; }) => {
    const [notes, setNotes] = useState<NoteData[]>([]);

    const fetchNotes = async () => {
        const notesCollection = collection(db, "notes");
        const notesQuery = query(notesCollection, where("userId", "==", auth.currentUser?.uid));
        const noteSnapshot = await getDocs(notesQuery);

        const noteList = noteSnapshot.docs.map((doc) => ({
            id: doc.id,
            content: doc.data().content,
            folder: doc.data().folder,
            label: doc.data().label,
            createdAt: doc.data().createdAt,
            userId: doc.data().userId,
        }));

        setNotes(noteList.sort((a, b) => b.createdAt - a.createdAt));
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const createNote = async (content: string, folder?: string, label?: string, userId?: string): Promise<string> => {
        const newDate = Timestamp.fromDate(new Date());

        try {
            const noteData = {
                content,
                folder: folder || "",
                label: label || "",
                userId: userId || "",
                createdAt: newDate,
            };

            const docRef = await addDoc(collection(db, "notes"), noteData);

            setNotes([{ id: docRef.id, ...noteData }, ...notes]);
            console.log("note created");
            return docRef.id;

        } catch (error) {
            console.error("Error creating note:", error);
            throw error;
        }
    };

    const deleteNote = async (id: string) => {
        try {
            await deleteDoc(doc(db, "notes", id));
            setNotes(notes.filter(note => note.id !== id));
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    return (
        <NoteContext.Provider value={ { notes, fetchNotes, createNote, deleteNote } }>
            { children }
        </NoteContext.Provider>
    );
};