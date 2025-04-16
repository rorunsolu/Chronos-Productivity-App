import { createContext, useContext, useState, ReactNode } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "@/firebase/firebase";

export interface NoteData {
  id: string;
  content: string;
  folder?: string;
  label?: string;
  createdAt: Timestamp;
  title: string;
  userId?: string;
}

interface NotesContextType {
  notes: NoteData[];
  fetchNotes: () => void;
  deleteNote: (id: string) => void;
  createNote: (
    title: string,
    content: string,
    folder?: string,
    label?: string
  ) => Promise<string>;
}

const NoteContext = createContext<NotesContextType | undefined>(undefined);

export const UseNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("UseNotes must be used within a NotesProvider");
  }
  return context;
};

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<NoteData[]>([]);

  // const user = auth.currentUser;
  // if (!user) return;

  const fetchNotes = async () => {
    const notesCollection = collection(db, "notes");
    const notesQuery = query(
      notesCollection,
      where("userId", "==", auth.currentUser?.uid)
    );
    const noteSnapshot = await getDocs(notesQuery);

    const noteList = noteSnapshot.docs.map((doc) => ({
      id: doc.id,
      content: doc.data().content,
      folder: doc.data().folder,
      label: doc.data().label,
      createdAt: doc.data().createdAt,
      title: doc.data().title,
      userId: doc.data().userId, // Added this to try and fix the "You don't own the selected folder" error
    }));

    setNotes(noteList.sort((a, b) => b.createdAt - a.createdAt));
  };

  const createNote = async (
    title: string,
    content: string,
    folder?: string,
    label?: string
  ): Promise<string> => {
    const newDate = Timestamp.fromDate(new Date());

    const user = auth.currentUser;

    if (!user) {
      alert("Authentication required");
      throw new Error("User is not authenticated");
    }

    try {
      const noteData = {
        title,
        content,
        folder: folder || "",
        label: label || "",
        userId: user.uid,
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
      setNotes(notes.filter((note) => note.id !== id));
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
