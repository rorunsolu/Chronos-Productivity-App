import "@/pages/Folder Edit Page/FolderEditPage.scss";
import Modal from "react-modal";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FolderNoteCard from "@/features/Folders/Folder Note Card/FolderNoteCard";
import { UseFolders } from "@/features/Folders/context/FolderContext";
import { UseNotes } from "@/features/Notes/context/NoteContext";
import { Plus, Search, ArrowDownUp, ArrowUpDown } from "lucide-react";
import Dropdown from "@/components/Dropdown/Dropdown";
import { UserAuth } from "@/contexts/authContext/AuthContext";

const FolderEditPage = () => {
    const { user } = UserAuth();

    const { id } = useParams<{ id: string; }>();

    const labelOptions = ["Personal", "Work", "School"];

    const { folders, fetchFolders, addNoteToFolder } = UseFolders();
    const { notes, fetchNotes, createNote } = UseNotes();

    const [folderName, setFolderName] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [noteLabel, setNoteLabel] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [isNewestFirst, setIsNewestFirst] = useState(true);

    const currentFolder = folders.find(folder => folder.id === id);

    const handleNoteCreation = async () => {
        if (!currentFolder) return;

        if (!user) {
            console.error("User is not authenticated.");
            return;
        }

        try {
            const newNoteID = await createNote(noteContent, currentFolder.id, noteLabel, user.uid);
            await addNoteToFolder(currentFolder.id, newNoteID);
            setNoteContent("");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating note:", error);
        }
    };

    useEffect(() => {
        fetchFolders();
        fetchNotes();
    }, []);

    useEffect(() => {
        if (currentFolder) {
            setFolderName(currentFolder.name || "");
        }
    }, [currentFolder]);

    const getFolderNotes = () => {
        if (!currentFolder) return [];
        return notes.filter(note => currentFolder.notes.includes(note.id));
    };

    return (
        <div className="page-wrapper">
            <div className="folder-edit-page">

                <header className="folder-edit-page__header">
                    <h1 className="folder-edit-page__title">{ folderName }</h1>
                </header>

                <div className="folder-edit-page__actions">

                    <form className="folder-edit-page__form">
                        <Search />
                        <input
                            className="folder-edit-page__form-input"
                            type="text"
                            placeholder="Search notes"
                            value={ searchQuery }
                            onChange={ (e) => setSearchQuery(e.target.value) }
                        />
                    </form>

                    <button
                        className="folder-edit-page__actions-button"
                        onClick={ openModal }
                    >
                        <Plus />
                    </button>

                    <button
                        className="folder-edit-page__actions-button"
                        onClick={ () => setIsNewestFirst(!isNewestFirst) }
                    >
                        { isNewestFirst ? (<ArrowDownUp />) : (<ArrowUpDown />) }
                    </button>

                </div>

                <ul className="folder-edit-page__notes-list">
                    { getFolderNotes().map(note => (
                        <FolderNoteCard key={ note.id } note={ note } />
                    )) }
                </ul>

            </div>

            <Modal
                isOpen={ isModalOpen }
                onRequestClose={ () => setIsModalOpen(false) }
                contentLabel="Create a new note"
                className={ `modal ${isModalOpen ? "modal--open" : ""}` }
                overlayClassName="modal-overlay"
                appElement={ document.getElementById('root') || undefined }
            >

                <p className="modal__title">Add a Note</p>

                <div className="modal__input-group">
                    <input
                        placeholder="Type your note here..."
                        value={ noteContent }
                        onChange={ (e) => setNoteContent(e.target.value) }
                    />
                </div>

                <div className="modal__input-group">
                    <Dropdown
                        value={ noteLabel }
                        options={ labelOptions }
                        onChange={ (value: string) => setNoteLabel(value) }
                        placeholder="Select a label"
                    />
                </div>

                <div className="modal__button-wrapper">

                    <button
                        className="modal__close-button"
                        onClick={ () => setIsModalOpen(false) }
                    >
                        Close
                    </button>

                    <button className="modal__button" onClick={ handleNoteCreation } disabled={ !noteContent }>Create Note</button>
                </div>

            </Modal>

        </div>
    );
};

export default FolderEditPage;