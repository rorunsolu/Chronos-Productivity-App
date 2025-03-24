import Dropdown from "@/components/Dropdown/Dropdown";
import { db } from "@/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NoteData } from "@/features/Notes/context/NoteContext";
import { useEffect, useState, useCallback } from "react";
import { UseFolders } from "@/features/Folders/context/FolderContext";
import { useParams } from "react-router-dom";
import "@/pages/Note Edit Page/NoteEditPage.scss";
import { NotepadText, Tag } from 'lucide-react';
import { set } from "date-fns";

// Todo: deelting a folder doesn't update the state of notes folder when vieiwing on the note list page

const NoteEditPage = () => {
    const { id } = useParams<{ id: string; }>();
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const [note, setNote] = useState<NoteData>();
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [noteFolder, setNoteFolder] = useState("");

    const { folders, fetchFolders, addNoteToFolder, removeNoteFromFolder, updateFolder } = UseFolders();
    const folderOptions = folders.map(folder => folder.name);

    // runs only if the something changes in the folders
    useEffect(() => {
        fetchFolders();
    }, [fetchFolders]);

    useEffect(() => {

        if (isInitialLoad) {
            setIsInitialLoad(false);
            return;
        }

        const fetchNote = async () => {

            if (!id) return;

            const noteRef = doc(db, "notes", id);
            const noteSnapshot = await getDoc(noteRef);

            if (!noteSnapshot.exists()) {
                console.log("Note does not exist");
                setIsLoading(false);
                return;
            }

            const noteObjectData = noteSnapshot.data();

            setNoteTitle(noteObjectData.title || "");
            setNoteContent(noteObjectData.content || "");
            setNoteFolder(noteObjectData.folder || "");
            setNote(noteObjectData as NoteData);

            setIsLoading(false);
        };
        fetchNote();
    }, [id, isInitialLoad]);

    const updateNoteInFirebase = useCallback(async (newTitle: string, newContent: string, newFolder?: string) => {
        try {

            if (!id) return;

            const note = doc(db, "notes", id);
            await setDoc(note,
                {
                    title: newTitle,
                    content: newContent,
                    folder: newFolder
                }, { merge: true });

        } catch (error) {
            console.error("Error updating note:", error);
        } finally {
            setIsLoading(false);
            console.log("Note updated");
        }
    }, [id]);

    useEffect(() => {
        console.log("checking if note has changed, finna wait 1 second before updating in firebase");

        const hasChanged = (
            noteTitle !== note?.title ||
            noteContent !== note?.content ||
            noteFolder !== note?.folder
        );

        if (!hasChanged) return;

        setIsLoading(true);

        const getNoteData = setTimeout(() => {
            console.log("updating note in firebase");
            updateNoteInFirebase(noteTitle, noteContent, noteFolder);
        }, 2000);

        return () => clearTimeout(getNoteData);

    }, [noteTitle, noteContent, noteFolder, note?.title, note?.content, note?.folder, updateNoteInFirebase]);

    return (
        <div className="flex w-full h-full justify-center items-center">
            <div className="note-edit-page">

                { isLoading && <p>Saving...</p> }

                <div className="note-edit-page__dropdowns">
                    <div className="note-edit-page__dropdown">
                        <Dropdown
                            options={ folderOptions }
                            value={ noteFolder }
                            onChange={ setNoteFolder }
                            placeholder="Select Folder"
                        />
                    </div>

                </div>



                <header className="note-edit-page__header">
                    <input className="note-edit-page__header-title"
                        onChange={ (e) => setNoteTitle(e.target.value) }
                        value={ noteTitle } type="text" placeholder="Title" />
                </header>


                <textarea className="note-edit-page__description"
                    onChange={ (e) => setNoteContent(e.target.value) }
                    value={ noteContent }
                    placeholder="Description" />
            </div>

        </div>
    );
};

export default NoteEditPage;
