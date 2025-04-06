import Dropdown from "@/components/Dropdown/Dropdown";
import { db } from "@/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NoteData } from "@/features/Notes/context/NoteContext";
import { useEffect, useState, useCallback, useMemo } from "react";
import { UseFolders } from "@/features/Folders/context/FolderContext";
import { useParams } from "react-router-dom";
import "@/pages/Note Edit Page/NoteEditPage.scss";
import { Folder } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Todo: Need to add a removal options for the dropdowns

const NoteEditPage = () => {
    const { id } = useParams<{ id: string; }>();
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const [note, setNote] = useState<NoteData>();
    const [noteContent, setNoteContent] = useState("");
    const [noteFolder, setNoteFolder] = useState("");

    const { folders, fetchFolders, addNoteToFolder, removeNoteFromFolder } = UseFolders();
    const folderOptions = useMemo(
        () => folders.map(folder => ({ folderID: folder.id, folderName: folder.name })),
        [folders]
    );

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

            setNoteContent(noteObjectData.content || "");
            setNoteFolder(noteObjectData.folder || "");
            setNote(noteObjectData as NoteData);

            setIsLoading(false);
        };
        fetchNote();
    }, [id, isInitialLoad]);

    const updateNoteInFirebase = useCallback(async (newContent: string) => {
        try {

            if (!id) return;

            const note = doc(db, "notes", id);
            await setDoc(note,
                {
                    content: newContent,
                }, { merge: true });

        } catch (error) {
            console.error("Error updating something other than the assigned folder:", error);
        } finally {
            setIsLoading(false);
            console.log("Note updated");
        }
    }, [id]);

    const handleFolderChange = async (newFolderID: string) => {

        if (!id) return;

        const oldFolderID = note?.folder;

        if (oldFolderID === newFolderID) return;

        if (oldFolderID) {
            removeNoteFromFolder(oldFolderID, id);
            setNote(prevNoteData => prevNoteData ? { ...prevNoteData, folder: "" } : prevNoteData);
        }

        if (newFolderID) {
            addNoteToFolder(newFolderID, id);
            setNote(prevNoteData => prevNoteData ? { ...prevNoteData, folder: newFolderID } : prevNoteData);
            console.log("Note folder updated");
        }

        // Explanation for both: Now that the folder assigment has changed in Firebase, I also need to update the state locally (on my screen in the browser)
        // How: prevNoteData refers to the state/info of the note right before the folder was changed in firebase.
        // I check if the prevNoteData and if it does I then "spread" or rather pull apart the prevNoteData, grab the folder property/data and then either set it to an empty string or to the newFolderID (well the name of the folder tbh)
    };

    useEffect(() => {
        // const hasChanged = (
        //     noteContent !== note?.content
        // );

        const hasChanged = (
            noteContent.trim() !== "" &&
            noteContent !== note?.content
        );

        if (!hasChanged) return;

        setIsLoading(true);

        const getNoteData = setTimeout(() => {
            updateNoteInFirebase(noteContent);
        }, 1000);

        return () => clearTimeout(getNoteData);

    }, [note, noteContent, updateNoteInFirebase]);

    useEffect(() => {
        if (noteFolder === note?.folder) return;

        const getNoteFolder = setTimeout(() => {
            handleFolderChange(noteFolder);
        }, 1000);

        return () => clearTimeout(getNoteFolder);

    }, [note?.folder, noteFolder]);

    return (
        <div className="page-wrapper">

            <div className="note-edit-page">

                <div className="note-edit-page__dropdown-wrapper">

                    <div className="note-edit-page__dropdown">
                        <label className="note-edit-page__dropdown-label"><Folder size={ 20 } /></label>
                        <Dropdown
                            placeholder="Select a folder"
                            options={ folderOptions.map(option => option.folderName) }
                            value={ folderOptions.find(option => option.folderID === noteFolder)?.folderName || "" }
                            onChange={ (folderID: string) => {
                                const selectedFolder = folders.find(folder => folder.name === folderID);
                                setNoteFolder(selectedFolder?.id || "");
                            } }
                        />
                    </div>

                </div>

                <div className="note-edit-page__main">

                    { isLoading && <div className="loading-overlay">Saving...</div> }

                    <div className="note-edit-page__main">

                        <ReactQuill
                            theme="snow"
                            value={ noteContent }
                            onChange={ (value) => setNoteContent(value) }
                        />

                    </div>

                </div>

            </div>

        </div>
    );
};

export default NoteEditPage;
