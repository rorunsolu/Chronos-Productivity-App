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
import { UserAuth } from "@/contexts/authContext/AuthContext";

// Todo: Need to add a removal options for the dropdowns

const NoteEditPage = () => {
    const { user } = UserAuth();

    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const [note, setNote] = useState<NoteData>();
    const [noteContent, setNoteContent] = useState("");
    const [noteFolder, setNoteFolder] = useState("");
    const [noteTitle, setNoteTitle] = useState("");

    const { folders, fetchFolders, addNoteToFolder, removeNoteFromFolder } =
        UseFolders();
    const folderOptions = useMemo(
        () =>
            folders.map((folder) => ({
                folderID: folder.id,
                folderName: folder.name,
            })),
        [folders]
    );

    useEffect(() => {
        fetchFolders();
    }, []);

    useEffect(() => {
        if (isInitialLoad) {
            setIsInitialLoad(false);
            return;
        }

        const fetchNote = async () => {
            try {
                if (!id || !user) {
                    console.log("Missing note ID or user authentication");
                    setIsLoading(false);
                    return;
                }

                const noteRef = doc(db, "notes", id);
                const noteSnapshot = await getDoc(noteRef);

                if (!noteSnapshot.exists()) {
                    console.log("Note does not exist");
                    alert("This note could not be found");
                    setIsLoading(false);
                    return;
                }

                const noteData = noteSnapshot.data();
                if (noteData.userId !== user.uid) {
                    console.log("Unauthorized access attempt");
                    alert("You don't have permission to access this note");
                    setIsLoading(false);
                    return;
                }

                const noteObjectData = noteSnapshot.data();

                setNoteTitle(noteObjectData.title || "");
                setNoteContent(noteObjectData.content || "");
                setNoteFolder(noteObjectData.folder || "");
                setNote(noteObjectData as NoteData);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNote();
    }, [id, user, isInitialLoad]);

    const updateNoteInFirebase = useCallback(
        async (newTitle: string, newContent: string) => {
            try {
                if (!id || !user) return;

                await setDoc(
                    doc(db, "notes", id),
                    {
                        title: newTitle,
                        content: newContent,
                        userId: user.uid,
                    },
                    { merge: true }
                );
            } catch (error) {
                console.error(
                    "Error updating something other than the assigned folder:",
                    error
                );
            } finally {
                setIsLoading(false);
                console.log("Note updated");
            }
        },
        [id, user]
    );

    const handleFolderChange = async (newFolderID: string) => {
        try {
            if (!id || !user) {
                console.log("Missing note ID or user authentication");
                return;
            }

            const oldFolderID = note?.folder;
            if (oldFolderID === newFolderID) return;

            const oldFolder = folders.find(
                (folder) => folder.id === oldFolderID
            );
            const newFolder = folders.find(
                (folder) => folder.id === newFolderID
            );

            const unauthorizedFolder = [oldFolder, newFolder].find(
                (folder) => folder && folder.userId !== user.uid
            );

            if (unauthorizedFolder) {
                console.log("Unauthorized folder modification");
                alert(
                    `You don't own the ${
                        unauthorizedFolder === oldFolder ? "old" : "selected"
                    } folder`
                );
                return;
            }

            if (oldFolderID) {
                removeNoteFromFolder(oldFolderID, id);
                setNote((prevNoteData) =>
                    prevNoteData
                        ? { ...prevNoteData, folder: "" }
                        : prevNoteData
                );
            }

            if (newFolderID) {
                addNoteToFolder(newFolderID, id);
                setNote((prevNoteData) =>
                    prevNoteData
                        ? { ...prevNoteData, folder: newFolderID }
                        : prevNoteData
                );
                console.log("Note folder updated");
            }

            await setDoc(
                doc(db, "notes", id),
                {
                    folder: newFolderID || null,
                    userId: user.uid,
                },
                { merge: true }
            );
        } catch (error) {
            console.error("Folder update failed:", error);
            alert("Failed to update folder assignment");
            setNoteFolder(note?.folder || "");
        }
    };

    useEffect(() => {
        const hasChanged =
            noteContent.trim() !== "" &&
            noteContent !== note?.content &&
            noteTitle.trim() !== "" &&
            noteTitle !== note?.title;

        if (!hasChanged) return;

        setIsLoading(true);

        const getNoteData = setTimeout(() => {
            updateNoteInFirebase(noteTitle, noteContent);
        }, 1000);

        return () => clearTimeout(getNoteData);
    }, [note, noteTitle, noteContent, updateNoteInFirebase]);

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
                <div className="note-edit-page__header">
                    <input
                        className="note-edit-page__title"
                        type="text"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                    />
                </div>

                <div className="note-edit-page__dropdown-wrapper">
                    <div className="note-edit-page__dropdown">
                        <label className="note-edit-page__dropdown-label">
                            <Folder size={20} />
                        </label>
                        <Dropdown
                            placeholder="Select a folder"
                            options={folderOptions.map(
                                (option) => option.folderName
                            )}
                            value={
                                folderOptions.find(
                                    (option) => option.folderID === noteFolder
                                )?.folderName || ""
                            }
                            onChange={(folderID: string) => {
                                const selectedFolder = folders.find(
                                    (folder) => folder.name === folderID
                                );
                                setNoteFolder(selectedFolder?.id || "");
                            }}
                        />
                    </div>
                </div>

                <div className="note-edit-page__main">
                    {isLoading && (
                        <div className="loading-overlay">Saving...</div>
                    )}

                    <div className="note-edit-page__main">
                        <ReactQuill
                            theme="snow"
                            value={noteContent}
                            onChange={(value) => setNoteContent(value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteEditPage;
