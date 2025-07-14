import { UserAuth } from "@/contexts/authContext/AuthContext";
import { UseFolders } from "@/features/Folders/context/FolderContext";
import { UseNotes } from "@/features/Notes/context/NoteContext";
import { Select, Stack, Textarea, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useParams } from "react-router-dom";
import "@/pages/Folder Edit Page/FolderEditPage.scss";
import SearchBar from "@/components/Search Bar/SearchBar";
import AddButton from "@/components/Add Button/AddButton";
import SortToggleButton from "@/components/Sort Toggle Button/SortToggleButton";
import InputHeader from "@/components/Input Header/InputHeader";
import NoteListCard from "@/features/Notes/Note List card/NoteListCard";

const FolderEditPage = () => {
  const { user } = UserAuth();

  const { id } = useParams<{ id: string }>();

  const labelOptions = ["Personal", "Work", "School"];

  const { folders, fetchFolders } = UseFolders();
  const { notes, fetchNotes, createNote, deleteNote } = UseNotes();

  const [folderName, setFolderName] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteLabel, setNoteLabel] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [isNewestFirst, setIsNewestFirst] = useState(true);

  const [noteFolderID, setNoteFolderID] = useState<string>(folderName);

  const currentFolder = folders.find((folder) => folder.id === id);

  const handleNoteCreation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      throw new Error("User is not authenticated");
    }

    try {
      await createNote(noteTitle, noteContent, noteFolderID, noteLabel);

      fetchNotes();
      fetchFolders();

      setIsModalOpen(false);
    } catch (error) {
      throw new Error(`Error creating note: ${error}`);
    }
  };

  const getFolderNotes = () => {
    if (!currentFolder) return [];
    return notes.filter((note) => currentFolder.notes.includes(note.id));
  };

  const filteredNotes = getFolderNotes()
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

  useEffect(() => {
    fetchFolders();
    fetchNotes();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (currentFolder) {
      setFolderName(currentFolder.name || "");
      setNoteFolderID(currentFolder.id || "");
    }
  }, [currentFolder]);

  return (
    <div className="page-wrapper">
      <div className="folder-edit-page">
        <header className="folder-edit-page__header">
          <h1 className="folder-edit-page__title">{folderName}</h1>
        </header>

        <div className="folder-edit-page__actions">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes"
          />

          <AddButton onClick={openModal} />

          <SortToggleButton
            isNewestFirst={isNewestFirst}
            onToggle={() => setIsNewestFirst(!isNewestFirst)}
          />
        </div>

        <ul className="folder-edit-page__notes-list">
          {filteredNotes.map((note) => (
            <NoteListCard key={note.id} note={note} deleteNote={deleteNote} />
          ))}
        </ul>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Create a new note"
        className={`modal ${isModalOpen ? "modal--open" : ""}`}
        overlayClassName="modal-overlay"
        appElement={document.getElementById("root") || undefined}
      >
        <p className="modal__title">Add a Note</p>
        <form className="modal__form" onSubmit={handleNoteCreation}>
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
                placeholder="Type your note here..."
                value={noteContent || ""}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </Stack>

            <Stack gap={2}>
              <InputHeader label="Label" />
              <Select
                placeholder="Select a label"
                data={labelOptions}
                checkIconPosition="right"
                value={noteLabel}
                onChange={(value) => setNoteLabel(value as string)}
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
        </form>
      </Modal>
    </div>
  );
};

export default FolderEditPage;
