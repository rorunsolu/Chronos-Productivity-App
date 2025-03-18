import { createContext, useContext, useState, ReactNode } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

interface FolderData {
    id: string;
    name: string;
}

interface FoldersContextType {
    folders: FolderData[];
    fetchFolders: () => void;
    createFolder: (name: string) => void;
    deleteFolder: (id: string) => void;
    updateFolder: (id: string, updates: Partial<FolderData>) => void;
}

const FolderContext = createContext<FoldersContextType | undefined>(undefined);

export const UseFolders = () => {
    const context = useContext(FolderContext);
    if (!context) {
        throw new Error("UseFolders must be used within a FoldersProvider");
    }
    return context;
};

export const FoldersProvider = ({ children }: { children: ReactNode; }) => {
    const [folders, setFolders] = useState<FolderData[]>([]);

    const fetchFolders = async () => {
        const foldersCollection = collection(db, "folders");
        const folderSnapshot = await getDocs(foldersCollection);

        const folderList = folderSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name
        }));

        setFolders(folderList.sort((a, b) => a.name.localeCompare(b.name)));
    }

    const createFolder = async (name: string) => {
        try {
            const docRef = await addDoc(collection(db, "folders"), {
                name
            });
    
            setFolders([{
                id: docRef.id,
                name
            }, ...folders]);
    
        } catch (error) {
            console.error("Error adding folder to firestore: ", error);
        }
    };

    const deleteFolder = async (id: string) => {
        try {
            await deleteDoc(doc(db, "folders", id));
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
        <FolderContext.Provider value={ { folders, fetchFolders, createFolder, deleteFolder, updateFolder } }>
            { children }
        </FolderContext.Provider>
    );
}