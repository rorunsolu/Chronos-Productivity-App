import { createContext, useContext, useState, ReactNode } from "react";
import { Timestamp, addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export interface FolderData {
    id: string;
    name: string;
    notes: string[] // array of note ID's
    createdAt: Timestamp;
}

interface FoldersContextType {
    folders: FolderData[];
    fetchFolders: () => void;
    createFolder: (name: string) => void;
    deleteFolder: (id: string) => void;
    updateFolder: (id: string, updates: Partial<FolderData>) => void;
    addNoteToFolder: (parentFolderId: string, childNoteId: string) => void;
    removeNoteFromFolder: (parentFolderId: string, childNoteId: string) => void;
}

const FolderContext = createContext<FoldersContextType | undefined>(undefined);

export const UseFolders = () => {
    const context = useContext(FolderContext);
    if (!context) {
        throw new Error("UseFolders must be used within a FolderProvider");
    }
    return context;
};

export const FolderProvider = ({ children }: { children: ReactNode; }) => {
    const [folders, setFolders] = useState<FolderData[]>([]);

    const fetchFolders = async () => {
        const foldersCollection = collection(db, "folders");
        const folderSnapshot = await getDocs(foldersCollection);

        const folderList = folderSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            notes: doc.data().notes || [],
            createdAt: doc.data().createdAt
        }));

        setFolders(folderList.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    }

    const createFolder = async (name: string) => {

        const newDate = Timestamp.fromDate(new Date());

        try {
            const folderData = {
                name,
                notes: [],
                createdAt: newDate
            };

            const folderDocRef = await addDoc(collection(db, "folders"), folderData);

            setFolders([
                {
                    id: folderDocRef.id,
                    ...folderData
                },
                ...folders
            ]);


        } catch (error) {
            console.error("Error adding folder to firestore: ", error);
        }
    };

    const addNoteToFolder = async (parentFolderId: string, childNoteId: string) => {
        try {
            const folderRef = doc(db, "folders", parentFolderId);
            const noteRef = doc(db, "notes", childNoteId);

            await updateDoc(folderRef, {
                notes: arrayUnion(noteRef)
            });

            await updateDoc(noteRef, {
                parentFolder: folderRef
            });

            setFolders(folders.map(folder =>
                folder.id === parentFolderId ? {
                    ...folder,
                    notes: [...folder.notes, childNoteId],
                } : folder
            ));

        } catch (error) {
            console.error("Error adding note to folder in firestore: ", error);
        }
    }

    const removeNoteFromFolder = async (parentFolderId: string, childNoteId: string) => {
        const folderRef = doc(db, "folders", parentFolderId);
        const noteRef = doc(db, "notes", childNoteId);

        await updateDoc(folderRef, {
            notes: arrayRemove(noteRef)
        });

        await updateDoc(noteRef, {
            parentFolder: folderRef
        });

        setFolders(folders.map(folder =>
            folder.id === parentFolderId ? {
                ...folder,
                notes: folder.notes.filter(noteId => noteId !== childNoteId),
            } : folder
        ));
    }

    const deleteFolder = async (id: string) => {
        try {
            await deleteDoc(doc(db, "folders", id));
            setFolders(folders.filter((folder) => folder.id !== id));
        } catch (error) {
            console.error("Error deleting folder from firestore: ", error);
        }
    }

    const updateFolder = async (id: string, updates: Partial<FolderData>) => {
        try {
            const folderRef = doc(db, "folders", id);
            await updateDoc(folderRef, updates);
        } catch (error) {
            console.error("Error updating folder in firestore: ", error);
        }
    }

    return (
        <FolderContext.Provider value={ { folders, fetchFolders, createFolder, deleteFolder, updateFolder, addNoteToFolder, removeNoteFromFolder } }>
            { children }
        </FolderContext.Provider>
    );
}