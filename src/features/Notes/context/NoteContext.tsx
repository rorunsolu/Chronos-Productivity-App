import { createContext, useContext, useState, ReactNode } from 'react';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from "../../../firebase/firebase";
// import { query, where } from 'firebase/firestore';
// import { auth } from "../../../firebase/firebase";


export interface Notedata {
    id: string;
    title: string;
    content: string;
    createdAt: Timestamp;
}

interface NotesContextType {
    notes: Notedata[];
    fetchNotes: () => void;
    deleteNote: (id: string) => void;
    createNote: (title: string) => void;
    //createNote: (title: string, content: string) => void;
    //updateNote: (id: string, title: string, content: string) => void;
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
    const [notes, setNotes] = useState<Notedata[]>([]);

    const fetchNotes = async () => {
        // Go back and add the auth match check so that a user can only see notes associated with their own account (unique id)

        const notesCollection = collection(db, "notes");
        // const notesQuery = query(notesCollection, where("userId", "==", auth.currentUser.uid)) ignore this for now
        const noteSnapshot = await getDocs(notesCollection);

        const noteList = noteSnapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            content: doc.data().content,
            createdAt: doc.data().createdAt
        }));

        setNotes(noteList.sort((a, b) => b.createdAt - a.createdAt));
    };

    // const createNote = async (title: string, content: string) => {
    const createNote = async (title: string) => {
        //if (!auth.currentUser) return;

        const newDate = Timestamp.fromDate(new Date());

        try {
            const docRef = await addDoc(collection(db, "notes"), {
                title,
                content: "",
                createdAt: newDate,
                //userId: auth.currentUser.uid
            });

            setNotes([
                {
                    id: docRef.id,
                    title,
                    content: "",
                    createdAt: newDate
                }, ...notes
            ]);

        } catch (error) {
            console.error("Error creating note:", error);
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
        <NoteContext.Provider value={{ notes, fetchNotes, createNote, deleteNote }}>
            {children}
        </NoteContext.Provider>
    );
};