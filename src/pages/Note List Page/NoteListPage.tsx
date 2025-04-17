import Dropdown from "@/components/Dropdown/Dropdown";
import { UserAuth } from "@/contexts/authContext/AuthContext";
import { UseNotes } from "@/features/Notes/context/NoteContext";
import { Tag } from "lucide-react";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import TextareaAutosize from "react-textarea-autosize";
import "@/pages/Note List Page/NoteListPage.scss";
import NoteListCard from "@/features/Notes/Note List card/NoteListCard";
import SearchBar from "@/components/Search Bar/SearchBar";
import AddButton from "@/components/Add Button/AddButton";
import SortToggleButton from "@/components/Sort Toggle Button/SortToggleButton";

const NoteListPage = () => {
  const { user } = UserAuth();

  const { notes, fetchNotes, createNote, deleteNote } = UseNotes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteFolder, setNoteFolder] = useState("");
  const [noteLabel, setNoteLabel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isNewestFirst, setIsNewestFirst] = useState(true);
  const labelOptions = ["Personal", "Work", "School"];

  const filteredNotes = notes
    .filter((note) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        note.title?.toLowerCase().includes(searchLower),
        note.content?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const dateA = a.createdAt.toDate();
      const dateB = b.createdAt.toDate();
      return isNewestFirst
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

  const handleCreateNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    createNote(noteTitle, noteContent, noteFolder, noteLabel);
    setNoteTitle("");
    setNoteContent("");
    setNoteFolder("");
    setNoteLabel("");
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  //todo: Clicking a note should open a modal with the task details and options to edit or delete the task.
  //todo: Add tooltips for the buttons

  return (
    <div className="page-wrapper">
      <div className="note-list-page">
        <div className="note-list-page__header">
          <h1 className="note-list-page__title">Notes</h1>
          <p className="note-list-page__subtitle">
            All your notes in one place
          </p>
        </div>

        <div className="note-list-page__actions">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks"
          />
          <div className="task-list-page__actions-buttons">
            <AddButton onClick={openModal} />

            <SortToggleButton
              isNewestFirst={isNewestFirst}
              onToggle={() => setIsNewestFirst(!isNewestFirst)}
            />
          </div>
        </div>

        <ul className="note-list-page__note-list">
          {filteredNotes.map((note) => (
            <NoteListCard key={note.id} note={note} deleteNote={deleteNote} />
          ))}
        </ul>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Create a new note"
          className={`modal ${isModalOpen ? "modal--open" : ""}`}
          overlayClassName="modal-overlay"
          appElement={document.getElementById("root") || undefined}
        >
          <h3 className="modal__title">Create note</h3>

          <form className="modal__form" onSubmit={handleCreateNote}>
            <div className="modal__input-wrapper">
              <label htmlFor="noteTitle" className="modal__label">
                Title
              </label>
              <input
                className="modal__input"
                type="text"
                placeholder="Enter title"
                onChange={(e) => setNoteTitle(e.target.value)}
                value={noteTitle}
              />
            </div>

            <TextareaAutosize
              className="modal__textarea"
              onChange={(e) => setNoteContent(e.target.value)}
              value={noteContent}
            />

            <div className="modal__option-wrapper">
              <div className="modal__option">
                <label className="modal__label">
                  <Tag size={20} />
                </label>
                <Dropdown
                  options={labelOptions}
                  value={noteLabel}
                  onChange={(value: string) => setNoteLabel(value)}
                  placeholder="Select a label"
                />
              </div>
            </div>

            <div className="modal__button-wrapper">
              <button
                className="modal__button modal__button--create"
                disabled={!noteTitle || !noteContent}
                type="submit"
              >
                Create note
              </button>

              <button
                className="modal__button modal__button--cancel"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default NoteListPage;
