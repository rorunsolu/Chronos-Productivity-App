import { useNavigate } from "react-router-dom";
import { NoteData } from "@/features/Notes/context/NoteContext";
import "@/features/Folders/Folder Note Card/FolderNoteCard.scss";
import { Tag } from 'lucide-react';
import DOMPurify from "dompurify";

const FolderNoteCard = ({ note }: { note: NoteData }) => {

    const navigate = useNavigate();

    const htmlToPlainText = (html: string) => {
        const cleanHtml = DOMPurify.sanitize(html);
        const doc = new DOMParser().parseFromString(cleanHtml, "text/html");
        return doc.body.textContent || "";
    };

    const plainContent = htmlToPlainText(note.content);

    return (
        <div className="folder-note-card" onClick={ () => navigate(`/notes/${note.id}`) }>

            { note.content && <p className="folder-note-card__description">{ plainContent }</p> }

            <div className="folder-note-card__meta">

                { note.label && (
                    <span className="folder-note-card__badge folder-note-card__badge--label">
                        <Tag size={ 13 } />{ note.label }
                    </span>
                ) }

            </div>

        </div>
    )
}

export default FolderNoteCard;
