import { UseFolders } from "@/features/Folders/context/FolderContext";
import { Stack } from "@mantine/core";
import { TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "@/pages/Folder List Page/FolderListPage.scss";
import FolderListCard from "@/features/Folders/Folder List Card/FolderListCard";
import SearchBar from "@/components/Search Bar/SearchBar";
import AddButton from "@/components/Add Button/AddButton";
import InputHeader from "@/components/Input Header/InputHeader";
import SortToggleButton from "@/components/Sort Toggle Button/SortToggleButton";

const FolderListPage = () => {
  const { folders, fetchFolders, createFolder, deleteFolder } = UseFolders();
  const [noteName, setNoteName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewestFirst, setIsNewestFirst] = useState(true);
  const openModal = () => setIsModalOpen(true);

  const handleCreateFolder = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    createFolder(noteName);
    setNoteName("");
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchFolders();
    // eslint-disable-next-line
  }, []);

  const filteredFolders = folders
    .filter((folder) => {
      const searchLower = searchQuery.toLowerCase();
      return folder.name?.toLowerCase().includes(searchLower);
    })
    .sort((a, b) => {
      const dateA = a.createdAt.toDate();
      const dateB = b.createdAt.toDate();
      return isNewestFirst
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

  return (
    <div className="page-wrapper">
      <div className="folder-list-page">
        <div className="folder-list-page__header">
          <h1 className="folder-list-page__title">Folders</h1>
          <p className="folder-list-page__subtitle">
            Access and manage your folders
          </p>
        </div>

        <div className="folder-list-page__actions">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
          <div className="folder-list-page__actions-buttons">
            <AddButton onClick={openModal} />

            <SortToggleButton
              isNewestFirst={isNewestFirst}
              onToggle={() => setIsNewestFirst(!isNewestFirst)}
            />
          </div>
        </div>

        <div>
          <ul className="folder-list-page__folder-list">
            {filteredFolders.map((folder) => (
              <FolderListCard
                folder={folder}
                key={folder.id}
                deleteFolder={deleteFolder}
              />
            ))}
          </ul>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Create a new folder"
          className={`modal ${isModalOpen ? "modal--open" : ""}`}
          overlayClassName="modal-overlay"
          appElement={document.getElementById("root") || undefined}
        >
          <p className="modal__title">Create a folder</p>

          <form className="modal__form" onSubmit={handleCreateFolder}>
            <div className="modal__info-wrapper">
              <Stack gap="sm">
                <Stack gap={2}>
                  <InputHeader label="Name" />
                  <TextInput
                    withAsterisk
                    placeholder="Folder Name"
                    value={noteName}
                    onChange={(e) => setNoteName(e.target.value)}
                  />
                </Stack>
              </Stack>

              <div className="modal__button-wrapper">
                <button
                  className="modal__button modal__button--create"
                  disabled={!noteName}
                  type="submit"
                >
                  Create Folder
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

export default FolderListPage;
