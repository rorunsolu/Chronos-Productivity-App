import { FolderData } from "@/features/Folders/context/FolderContext";
import { UseNotes } from "@/features/Notes/context/NoteContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@/features/Folders/Folder List Card/FolderListCard.scss";
import MenuToggle from "@/components/Menu Toggle/MenuToggle";

const FolderListCard: React.FC<FolderListCardProps> = ({
  folder,
  deleteFolder,
}) => {
  const navigate = useNavigate();
  const { notes, fetchNotes } = UseNotes();
  const folderNotes = notes.filter((note) => folder.notes.includes(note.id));

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, []);

  return (
    <li
      className="folder-list-card"
      onClick={() => navigate(`/folders/${folder.id}`)}
    >
      <div className="folder-list-card__header">
        <h3 className="folder-list-card__title line-clamp-1">{folder.name}</h3>
        <p className="folder-list-card__count">{folderNotes.length}</p>
      </div>

      <div
        className="folder-list-card__actions"
        onClick={(e) => e.stopPropagation()}
      >
        <MenuToggle onDelete={() => deleteFolder(folder.id)} />
      </div>
    </li>
  );
};

export default FolderListCard;

interface FolderListCardProps {
  folder: FolderData;
  deleteFolder: (id: string) => void;
}
