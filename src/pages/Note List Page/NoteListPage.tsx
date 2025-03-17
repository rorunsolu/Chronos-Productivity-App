import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import { ListFilter, Plus, Search, EllipsisVertical } from "lucide-react";
import { UseNotes } from "../../features/Notes/context/NoteContext";
import "./NoteListPage.scss";
import "../../App.css";
import NoteListCard from "@/features/Notes/Note List card/NoteListCard";

const NoteListPage = () => {

   const { notes, fetchNotes, createNote, deleteNote } = UseNotes();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const openModal = () => setIsModalOpen(true);
   const [noteTitle, setNoteTitle] = useState("");
   const [noteContent, setNoteContent] = useState("");
   const [searchQuery, setSearchQuery] = useState("");

   const filteredNotes = notes.filter(task => {
      const searchLower = searchQuery.toLowerCase();
      return (
         task.title.toLowerCase().includes(searchLower) ||
         task.content?.toLowerCase().includes(searchLower)
      );
   });


   const handleCreateNote = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      createNote(noteTitle, noteContent);
      setNoteTitle("");
      setNoteContent("");
      setIsModalOpen(false);
   };

   useEffect(() => {
      fetchNotes();
   }, [fetchNotes]);

   //todo: Clicking a note should open a modal with the task details and options to edit or delete the task.
   //todo: Add tooltips for the buttons

   return (
      <div className="flex w-full h-full justify-center items-center mt-16">
         <div className="note-list-page">

            <div className="note-list-page__header">
               <h1 className="note-list-page__title">Notes</h1>
               <p className="note-list-page__subtitle">All your notes in one place</p>
            </div>

            <div className="note-list-page__actions">

               <form className="note-list-page__form">
                  <Search />
                  <input className="note-list-page__form-input" type="text" placeholder="Search notes"
                     value={ searchQuery }
                     onChange={ (e) => setSearchQuery(e.target.value) } />
               </form>

               <button className="note-list-page__actions-button" onClick={ openModal }>
                  <Plus />
               </button>

               <button className="note-list-page__actions-button" onClick={ () => console.log("Filter button clicked") }>
                  <ListFilter />
               </button>

               <button className="taskpage__actions-button">
                  <EllipsisVertical />
               </button>

            </div>

            <ul className="note-list-page__note-list">
               { filteredNotes.map(note => (
                  <NoteListCard key={ note.id } note={ note } deleteNote={ deleteNote } />
               )) }
            </ul>

            <Modal
               isOpen={ isModalOpen }
               onRequestClose={ () => setIsModalOpen(false) }
               contentLabel="Create a new note"
               className="modal"
               overlayClassName="modal-overlay"
               appElement={ document.getElementById('root') || undefined }>

               <p className="modal__title">Create note</p>

               <form className="modal__form" onSubmit={ handleCreateNote }>

                  <input
                     className="modal__input"
                     onChange={ (e) => setNoteTitle(e.target.value) }
                     value={ noteTitle }
                     type="text"
                     placeholder="Title"
                  />

                  <textarea
                     className="modal__textarea"
                     onChange={ (e) => setNoteContent(e.target.value) }
                     value={ noteContent }
                     placeholder="Content"
                  />

                  <button className="modal__button" disabled={ !noteTitle || !noteContent } type="submit">
                     Create note
                  </button>

                  <button
                     className="modal__button"
                     onClick={ () => setIsModalOpen(false) }
                     type="button"
                  >
                     Cancel
                  </button>

               </form>

            </Modal>

         </div>
      </div>
   );
};

export default NoteListPage;
