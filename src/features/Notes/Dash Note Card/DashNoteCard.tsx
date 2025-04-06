import { NoteData } from "@/features/Notes/context/NoteContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Tag, History } from 'lucide-react';
import "@/features/Notes/Dash Note Card/DashNoteCard.scss";
import InfoPill from "@/components/Info Pill/InfoPill";
import DOMPurify from "dompurify";

const DashNoteCard: React.FC<DashNoteCardProps> = ({ note }) => {

    const navigate = useNavigate();

    const htmlToPlainText = (html: string) => {
        const cleanHtml = DOMPurify.sanitize(html);
        const doc = new DOMParser().parseFromString(cleanHtml, "text/html");
        return doc.body.textContent || "";
    };

    const plainContent = htmlToPlainText(note.content);

    return (
        <li className="dash-note-card" key={ note.id } onClick={ () => navigate(`/notes/${note.id}`) }>

            <div className="dash-note-card__content">
                <p className="dash-note-card__content-description line-clamp-1">{ plainContent }</p>
            </div>

            <div className="dash-note-card__header">

                { note.folder && (
                    <InfoPill icon={ <Tag size={ 14 } /> } value={ note.folder } />
                ) }

                { note.createdAt && (
                    <InfoPill icon={ <History size={ 14 } /> } value={ note.createdAt ? format(note.createdAt.toDate(), "dd/MM/yyyy") : "Unknown Date" } />
                ) }

            </div>

        </li>
    );
};

export default DashNoteCard;

interface DashNoteCardProps {
    note: NoteData;
}