import { auth, db } from "@/firebase/firebase";
import { createContext, ReactNode, useContext, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
  query,
  updateDoc,
  where,
  arrayUnion,
} from "firebase/firestore";

export interface NoteData {
  id: string;
  content: string;
  folderID?: string | null;
  label?: string | null;
  createdAt: Timestamp;
  title: string;
  userId?: string;
  contentType: string;
}

interface NotesContextType {
  notes: NoteData[];
  fetchNotes: () => void;
  deleteNote: (id: string) => void;
  createNote: (
    title: string,
    content: string,
    folderID?: string,
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
      folderID: doc.data().folderID,
      label: doc.data().label,
      createdAt: doc.data().createdAt,
      title: doc.data().title,
      userId: doc.data().userId,
      contentType: "Note",
    }));

    setNotes(
      noteList.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
    );
  };

  const createNote = async (
    title: string,
    content: string,
    folderID?: string,
    label?: string
  ): Promise<string> => {
    const newDate = Timestamp.fromDate(new Date());

    const user = auth.currentUser;

    if (!user) {
      throw new Error("User is not authenticated");
    }

    try {
      const noteData = {
        title,
        content,
        folderID: folderID || "",
        label: label || "",
        userId: user.uid,
        createdAt: newDate,
        contentType: "Note",
      };

      const docRef = await addDoc(collection(db, "notes"), noteData);

      if (folderID) {
        const folderRef = doc(db, "folders", folderID);
        await updateDoc(folderRef, { notes: arrayUnion(docRef.id) });
      }

      setNotes([{ id: docRef.id, ...noteData }, ...notes]);

      return docRef.id;
    } catch (error) {
      throw new Error(`Error creating note: ${error}`);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, "notes", id));
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      throw new Error(`Error deleting note: ${error}`);
    }
  };

  return (
    <NoteContext.Provider value={{ notes, fetchNotes, createNote, deleteNote }}>
      {children}
    </NoteContext.Provider>
  );
};
