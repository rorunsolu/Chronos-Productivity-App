import { auth, db } from "@/firebase/firebase";
import { createContext, ReactNode, useContext, useState } from "react";
import {
  Timestamp,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

export interface FolderData {
  id: string;
  name: string;
  notes: string[];
  createdAt: Timestamp;
  userId?: string;
}

interface FoldersContextType {
  folders: FolderData[];
  fetchFolders: () => void;
  createFolder: (name: string) => void;
  deleteFolder: (id: string) => void;
  addNoteToFolder: (folderID: string, childNoteID: string) => void;
  removeNoteFromFolder: (folderID: string, childNoteID: string) => void;
}

const FolderContext = createContext<FoldersContextType | undefined>(undefined);

export const UseFolders = () => {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error("UseFolders must be used within a FolderProvider");
  }
  return context;
};

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const [folders, setFolders] = useState<FolderData[]>([]);

  const fetchFolders = async () => {
    const folderQuery = query(
      collection(db, "folders"),
      where("userId", "==", auth.currentUser?.uid)
    );

    const folderSnapshot = await getDocs(folderQuery);

    const folderList = folderSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      notes: doc.data().notes || [],
      createdAt: doc.data().createdAt,
      userId: doc.data().userId,
    }));

    setFolders(
      folderList.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
    );
  };

  const createFolder = async (name: string) => {
    const newDate = Timestamp.fromDate(new Date());
    const user = auth.currentUser;

    if (!user) {
      alert("Authentication required");
      throw new Error("User is not authenticated");
    }

    try {
      const folderData = {
        name,
        userId: user.uid,
        notes: [],
        createdAt: newDate,
      };

      const folderDocRef = await addDoc(collection(db, "folders"), folderData);

      setFolders([
        {
          id: folderDocRef.id,
          ...folderData,
        },
        ...folders,
      ]);
    } catch (error) {
      throw new Error(`Error creating folder: ${error}`);
    }
  };

  const addNoteToFolder = async (folderID: string, childNoteID: string) => {
    try {
      const folderRef = doc(db, "folders", folderID);
      const noteRef = doc(db, "notes", childNoteID);

      await updateDoc(folderRef, {
        notes: arrayUnion(childNoteID),
      });

      await updateDoc(noteRef, {
        folder: folderID,
      });

      setFolders(
        folders.map((folder) =>
          folder.id === folderID
            ? {
                ...folder,
                notes: [...folder.notes, childNoteID],
              }
            : folder
        )
      );
    } catch (error) {
      throw new Error(`Error adding note to folder: ${error}`);
    }
  };

  const removeNoteFromFolder = async (
    folderID: string,
    childNoteID: string
  ) => {
    const folderRef = doc(db, "folders", folderID);

    await updateDoc(folderRef, {
      notes: arrayRemove(childNoteID),
    });

    setFolders(
      folders.map((folder) =>
        folder.id === folderID
          ? {
              ...folder,
              notes: folder.notes.filter((noteId) => noteId !== childNoteID),
            }
          : folder
      )
    );
  };

  const deleteFolder = async (id: string) => {
    try {
      await deleteDoc(doc(db, "folders", id));
      setFolders(folders.filter((folder) => folder.id !== id));
    } catch (error) {
      throw new Error(`Error deleting folder: ${error}`);
    }
  };

  return (
    <FolderContext.Provider
      value={{
        folders,
        fetchFolders,
        createFolder,
        deleteFolder,
        addNoteToFolder,
        removeNoteFromFolder,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};
