import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import { UseFolders } from "@/features/Folders/context/FolderContext";
import "@/pages/Folder List Page/FolderListPage.scss";
import FolderListCard from "@/features/Folders/Folder List Card/FolderListCard";
import {
  ArrowDownUp,
  EllipsisVertical,
  ListFilter,
  Plus,
  Search,
} from "lucide-react";

const FolderListPage = () => {
  const { folders, fetchFolders, createFolder, deleteFolder } = UseFolders();
  const [noteName, setNoteName] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);

  const handleCreateFolder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createFolder(noteName);
    setNoteName("");

    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return (
    <div className="flex w-full h-full justify-center items-center mt-16">

      <div className="folder-list-page">

        <div className="project-list-page__header">
          <h1 className="project-list-page__title">Folders</h1>
          <p className="project-list-page__subtitle">Access and manage your folders</p>
        </div>

        <div className="project-list-page__actions">
          <form className="project-list-page__form">
            <Search />
            <input className="project-list-page__form-input" type="text" placeholder="Search projects" />
          </form>

          <button className="project-list-page__button" onClick={ () => console.log("Filter button clicked") }>
            <ListFilter />
          </button>

          <button className="project-list-page__button" onClick={ openModal }>
            <Plus />
          </button>

          <button className="project-list-page__button">
            <EllipsisVertical />
          </button>

        </div>

        <div>
          <ul className="project-list-page__project-list">

            { folders.map((folder) => (
              <FolderListCard folder={ folder } key={ folder.id } />
            )) }

          </ul>
        </div>

        <Modal
          isOpen={ isModalOpen }
          onRequestClose={ () => setIsModalOpen(false) }
          contentLabel="Create a new project"
          className="modal"
          overlayClassName="modal-overlay"
          appElement={ document.getElementById('root') || undefined }>

          <p className="modal__title">Create a new folder</p>
          <form className="modal__form" onSubmit={ handleCreateFolder }>

            <input
              className="modal__input"
              onChange={ (e) => setNoteName(e.target.value) }
              value={ noteName }
              type="text"
              placeholder="Title"
            />

            <div className="modal__button-wrapper">
              <button className="modal__button" disabled={ !noteName } type="submit">
                Create folder
              </button>

              <button
                className="modal__button"
                onClick={ () => setIsModalOpen(false) }
                type="button"
              >
                Cancel
              </button>
            </div>

          </form>
        </Modal>

      </div>

    </div>
  )
}

export default FolderListPage
