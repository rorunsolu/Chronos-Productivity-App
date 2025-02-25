import React, { useEffect, useState } from 'react';
// import { format } from 'date-fns';
// import { useNavigate } from 'react-router-dom';
import { UseNotes } from '../../features/Notes/context/NoteContext';
import Modal from 'react-modal';
import NotePageSection from "@/features/Notes/components/NotePageSection";
import './NotesPage.scss';
import '../../App.css';
import '../../features/Notes/styles/Note.scss';
// import Note from "@/features/Notes/components/Note";

const NotesPage = () => {

    const { notes, fetchNotes, createNote, deleteNote } = UseNotes();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    // const navigate = useNavigate();

    const handleCreateNote = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createNote(noteTitle, noteContent);
        setNoteTitle("");
        setNoteContent("");
    };

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    return (
        <div className="section">
            <div className="notespage">
                <div className="notespage__header">

                    <h1 className="notespage__title">Notes</h1>

                </div>

                <div className="notespage__inputs">

                    <form className="notespage__form">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <input className="notespage__form-input" type="text" placeholder="Search notes" />
                    </form>

                    <button className="notespage__filter-button" onClick={() => console.log("Filter button clicked")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                        </svg>
                    </button>

                    <button className="notespage__filter-button" onClick={openModal}>
                        New note
                    </button>

                </div>


                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Create a new note"
                    className="modal"
                    overlayClassName="modal-overlay">

                    <p className="modal__title">Create note</p>

                    <form className="modal__form" onSubmit={handleCreateNote}>

                        <input
                            className="modal__input"
                            onChange={(e) => setNoteTitle(e.target.value)}
                            value={noteTitle}
                            type="text"
                            placeholder="Title"
                        />

                        <textarea
                            className="modal__textarea"
                            onChange={(e) => setNoteContent(e.target.value)}
                            value={noteContent}
                            placeholder="Content"
                        />

                        <button className="modal__button" disabled={!noteTitle || !noteContent} type="submit">
                            Create note
                        </button>

                        <button
                            className="modal__button"
                            onClick={() => setIsModalOpen(false)}
                            type="button"
                        >
                            Cancel
                        </button>

                    </form>



                </Modal>

                <>

                    <ul className="notespage__notes-list">

                         <NotePageSection notes={notes} deleteNote={deleteNote} />

                        {/* {notes.map((note) => (
                            <div className="note" key={note.id} onClick={() => navigate(`/notes/${note.id}`)}>

                                <div className="note__header">

                                    <div className="note__header-items">

                                        <div className="note__header-item">
                                            <div className="note__header-dot"></div>
                                            <p className="note__header-text">{note.folder ? note.folder : "Unknown Folder"}</p>
                                        </div>

                                        <div className="note__header-item">
                                            <div className="note__header-dot"></div>
                                            <p className="note__header-text">
                                                {note.createdAt ? format(note.createdAt.toDate(), "dd/MM/yyyy") : "Unknown Date"}
                                            </p>
                                        </div>

                                    </div>


                                    <div className="note__header-actions">

                                        <button className="note__header-button note__header-button--fav" onClick={(e) => e.stopPropagation()}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12.0004 15L12.0004 22M8.00043 7.30813V9.43875C8.00043 9.64677 8.00043 9.75078 7.98001 9.85026C7.9619 9.93852 7.93194 10.0239 7.89095 10.1042C7.84474 10.1946 7.77977 10.2758 7.64982 10.4383L6.08004 12.4005C5.4143 13.2327 5.08143 13.6487 5.08106 13.9989C5.08073 14.3035 5.21919 14.5916 5.4572 14.7815C5.73088 15 6.26373 15 7.32943 15H16.6714C17.7371 15 18.27 15 18.5437 14.7815C18.7817 14.5916 18.9201 14.3035 18.9198 13.9989C18.9194 13.6487 18.5866 13.2327 17.9208 12.4005L16.351 10.4383C16.2211 10.2758 16.1561 10.1946 16.1099 10.1042C16.0689 10.0239 16.039 9.93852 16.0208 9.85026C16.0004 9.75078 16.0004 9.64677 16.0004 9.43875V7.30813C16.0004 7.19301 16.0004 7.13544 16.0069 7.07868C16.0127 7.02825 16.0223 6.97833 16.0357 6.92937C16.0507 6.87424 16.0721 6.8208 16.1149 6.71391L17.1227 4.19423C17.4168 3.45914 17.5638 3.09159 17.5025 2.79655C17.4489 2.53853 17.2956 2.31211 17.0759 2.1665C16.8247 2 16.4289 2 15.6372 2H8.36368C7.57197 2 7.17611 2 6.92494 2.1665C6.70529 2.31211 6.55199 2.53853 6.49838 2.79655C6.43707 3.09159 6.58408 3.45914 6.87812 4.19423L7.88599 6.71391C7.92875 6.8208 7.95013 6.87424 7.96517 6.92937C7.97853 6.97833 7.98814 7.02825 7.99392 7.07868C8.00043 7.13544 8.00043 7.19301 8.00043 7.30813Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>

                                        <button className="note__header-button note__header-button--delete" onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>

                                    </div>

                                </div>

                                <div className="note__content">
                                    <p className="note__content-title line-clamp-1">{note.title}</p>
                                    <p className="note__content-description line-clamp-3">{note.content}</p>
                                </div>

                                    {note.task ? (
                                        <div className="note__tasks">
                                        <div className="note__tasks-item">
                                            <p className="note__tasks-title">{note.task}</p>
                                            </div>
                                        </div>
                                    ) : ""}

                            </div>
                        ))} */}

                    </ul>

                </>

            </div>
        </div>
    );
};

export default NotesPage;
