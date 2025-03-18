import { FolderData } from "@/features/Folders/context/FolderContext";
import { useNavigate } from "react-router-dom";
import "@/features/Folders/Folder List Card/FolderListCard.scss";
import {
  Trash,
} from "lucide-react";

const FolderListCard: React.FC<FolderListCardProps> = ({ folder, deleteFolder }) => {

  const navigate = useNavigate();

  return (
    <li className="folder-list-card" onClick={ () => navigate(`/folders/${folder.id}`) }>

      <h3 className="folder-list-card__title">{ folder.name }</h3>

      <div className="folder-list-card__actions" onClick={ (e) => e.stopPropagation() }>
        <button className="folder-list-card__button" onClick={ (e) => { e.stopPropagation(); deleteFolder(folder.id); } }>
          <Trash />
        </button>
      </div>

    </li>
  )
}

export default FolderListCard;

interface FolderListCardProps {
  folder: FolderData;
  deleteFolder: (id: string) => void;
}