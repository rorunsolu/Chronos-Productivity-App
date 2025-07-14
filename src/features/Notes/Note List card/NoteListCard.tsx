import { UseFolders } from "@/features/Folders/context/FolderContext";
import { NoteData } from "@/features/Notes/context/NoteContext";
import DOMPurify from "dompurify";
import { Folder, Tag } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuToggle from "@/components/Menu Toggle/MenuToggle";
import "@/features/Notes/Note List card/NoteListCard.scss";
import InfoPill from "@/components/Info Pill/InfoPill";

const NoteListCard: React.FC<NoteListCard> = ({ note, deleteNote }) => {
  const { folders, fetchFolders } = UseFolders();

  useEffect(() => {
    fetchFolders();
    // eslint-disable-next-line
  }, []);

  const navigate = useNavigate();

  const htmlToPlainText = (html: string) => {
    const cleanHtml = DOMPurify.sanitize(html);
    const doc = new DOMParser().parseFromString(cleanHtml, "text/html");
    return doc.body.textContent || "";
  };

  const plainContent = htmlToPlainText(note.content);
  const plainTitle = htmlToPlainText(note.title);
  const folderName = folders.find(
    (folder) => folder.id === note.folderID
  )?.name;

  return (
    <li
      className="note-list-card"
      key={note.id}
      onClick={() => navigate(`/notes/${note.id}`)}
    >
      <div className="note-list-card__header">
        <div className="note-list-card__header-items">
          {folderName && (
            <InfoPill
              size="sm"
              icon={<Folder size={14} />}
              value={folderName}
            />
          )}

          {note.label && (
            <InfoPill size="sm" icon={<Tag size={13} />} value={note.label} />
          )}
        </div>

        <div className="note-list-card__header-actions">
          <MenuToggle onDelete={() => deleteNote(note.id)} />
        </div>
      </div>

      <div className="note-list-card__content">
        <p className="note-list-card__content-title line-clamp-1">
          {plainTitle}
        </p>
        <p className="note-list-card__content-description line-clamp-3">
          {plainContent}
        </p>
      </div>
    </li>
  );
};

export default NoteListCard;

interface NoteListCard {
  note: NoteData;
  deleteNote: (id: string) => void;
}
