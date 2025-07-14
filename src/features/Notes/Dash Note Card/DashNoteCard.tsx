import { NoteData } from "@/features/Notes/context/NoteContext";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import { History, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "@/features/Notes/Dash Note Card/DashNoteCard.scss";
import InfoPill from "@/components/Info Pill/InfoPill";

const DashNoteCard: React.FC<DashNoteCardProps> = ({ note }) => {
  const navigate = useNavigate();

  const htmlToPlainText = (html: string) => {
    const cleanHtml = DOMPurify.sanitize(html);
    const doc = new DOMParser().parseFromString(cleanHtml, "text/html");
    return doc.body.textContent || "";
  };

  const plainContent = htmlToPlainText(note.content);

  return (
    <li
      className="dash-note-card"
      key={note.id}
      onClick={() => navigate(`/notes/${note.id}`)}
    >
      <div className="dash-note-card__content">
        <p className="dash-note-card__content-description line-clamp-1">
          {plainContent}
        </p>
      </div>

      <div className="dash-note-card__header">
        {note.folderID && (
          <InfoPill icon={<Tag size={14} />} value={note.folderID} />
        )}

        {note.createdAt && (
          <InfoPill
            icon={<History size={14} />}
            value={
              note.createdAt
                ? format(note.createdAt.toDate(), "dd/MM/yyyy")
                : "Unknown Date"
            }
          />
        )}
      </div>
    </li>
  );
};

export default DashNoteCard;

interface DashNoteCardProps {
  note: NoteData;
}
