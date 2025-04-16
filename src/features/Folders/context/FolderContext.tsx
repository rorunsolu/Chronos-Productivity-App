import { createContext, useContext, useState, ReactNode } from "react";
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
import { db, auth } from "@/firebase/firebase";

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
  updateFolder: (id: string, updates: Partial<FolderData>) => void;
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

  // const user = auth.currentUser;
  // if (!user) return;

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
      userId: doc.data().userId, // Added this to try and fix the "You don't own the selected folder" error
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

      console.log("Folder created with ID: ", folderDocRef.id);
    } catch (error) {
      console.error("Error adding folder to firestore: ", error);
    }
  };

  const addNoteToFolder = async (folderID: string, childNoteID: string) => {
    try {
      const userIdTiedToFolder = folders.find(
        (folder) => folder.id === folderID
      )?.userId;
      if (!userIdTiedToFolder) {
        console.error("Folder not found in firestore: ", folderID);
        return;
      }
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
      console.error("Error adding note to folder in firestore: ", error);
    }
  };

  const removeNoteFromFolder = async (
    folderID: string,
    childNoteID: string
  ) => {
    const folderRef = doc(db, "folders", folderID);
    const noteRef = doc(db, "notes", childNoteID);

    await updateDoc(folderRef, {
      notes: arrayRemove(noteRef),
    });

    await updateDoc(noteRef, {
      folder: "",
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
      console.error("Error deleting folder from firestore: ", error);
    }
  };

  //! I need to keep (updateFolder) this incase I need to add functionality to thencga ehte name of the folder
  const updateFolder = async (id: string, updates: Partial<FolderData>) => {
    try {
      const folderRef = doc(db, "folders", id);
      await updateDoc(folderRef, updates);
    } catch (error) {
      console.error("Error updating folder in firestore: ", error);
    }
  };

  return (
    <FolderContext.Provider
      value={{
        folders,
        fetchFolders,
        createFolder,
        deleteFolder,
        updateFolder,
        addNoteToFolder,
        removeNoteFromFolder,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};
