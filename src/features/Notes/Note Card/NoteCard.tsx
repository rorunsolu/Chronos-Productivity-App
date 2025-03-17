import { NoteData } from "@/features/Notes/context/NoteContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Tag, History } from 'lucide-react';
import "@/features/Notes/Note Card/NoteCard.scss";

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {

    const navigate = useNavigate();

    return (
        <li className="note-card" key={ note.id } onClick={ () => navigate(`/notes/${note.id}`) }>

            <div className="note-card__content">
                <p className="note-card__content-title line-clamp-1">{ note.title }</p>
                <p className="note-card__content-description line-clamp-1">{ note.content }</p>
            </div>

            <div className="note-card__header">

                { note.folder ? (
                    <div className="note-card__header-item">
                        <div className="note-card__header-icon">
                            <Tag size={ 14 } />
                        </div>
                        <p className="note-card__header-text">
                            { note.folder }
                        </p>
                    </div>
                ) : "" }

                <div className="note-card__header-item">
                    {/* <div className="note-card__header-dot"></div> */ }
                    <div className="note-card__header-icon">
                        <History size={ 14 } />
                    </div>
                    <p className="note-card__header-text">
                        { note.createdAt ? format(note.createdAt.toDate(), "dd/MM/yyyy") : "Unknown Date" }
                    </p>
                </div>

            </div>

        </li>
    )
}

export default NoteCard;

interface NoteCardProps {
    note: NoteData;
}