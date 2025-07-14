import { UserAuth } from "@/contexts/authContext/AuthContext";
import { UseNotes } from "@/features/Notes/context/NoteContext";
import { Select, Stack, Textarea, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "@/pages/Note List Page/NoteListPage.scss";
import NoteListCard from "@/features/Notes/Note List card/NoteListCard";
import SearchBar from "@/components/Search Bar/SearchBar";
import AddButton from "@/components/Add Button/AddButton";
import SortToggleButton from "@/components/Sort Toggle Button/SortToggleButton";
import InputHeader from "@/components/Input Header/InputHeader";

const NoteListPage = () => {
  const { user } = UserAuth();

  const { notes, fetchNotes, createNote, deleteNote } = UseNotes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteFolder, setNoteFolder] = useState("");
  const [noteLabel, setNoteLabel] = useState<string | null>("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isNewestFirst, setIsNewestFirst] = useState(true);

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

    createNote(noteTitle, noteContent, noteFolder, noteLabel ?? undefined);
    setNoteTitle("");
    setNoteContent("");
    setNoteFolder("");
    setNoteLabel("");
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, []);

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
          <p className="modal__title">Create a note</p>

          <form className="modal__form" onSubmit={handleCreateNote}>
            <div className="modal__info-wrapper">
              <Stack gap="sm">
                <Stack gap={2}>
                  <InputHeader label="Title" />
                  <TextInput
                    withAsterisk
                    placeholder="Title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                </Stack>

                <Stack gap={2}>
                  <InputHeader label="Content" />
                  <Textarea
                    size="sm"
                    autosize
                    minRows={2}
                    maxRows={8}
                    variant="default"
                    placeholder="Content"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  />
                </Stack>

                <Stack gap={2}>
                  <InputHeader label="Label" />
                  <Select
                    placeholder="Select a label"
                    data={["Personal", "Work", "School"]}
                    defaultValue={noteLabel}
                    value={noteLabel}
                    onChange={(value: string | null) => {
                      setNoteLabel(value);
                    }}
                    checkIconPosition="right"
                  />
                </Stack>
              </Stack>

              <div className="modal__button-wrapper">
                <button
                  className="modal__button modal__button--create"
                  disabled={!noteTitle || !noteContent}
                  type="submit"
                >
                  Create Note
                </button>

                <button
                  className="modal__button modal__button--cancel"
                  onClick={() => setIsModalOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default NoteListPage;
