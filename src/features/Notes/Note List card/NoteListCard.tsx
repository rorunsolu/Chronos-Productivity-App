import { format } from "date-fns";
import { noteProps } from "@/common/types";
import { useNavigate } from "react-router-dom";
import "@/features/Notes/Note List card/NoteListCard.scss";
import { Trash } from 'lucide-react';
import { Star } from 'lucide-react';

const NoteListCard: React.FC<noteProps> = ({ note, deleteNote }) => {

    const navigate = useNavigate();

    return (
        <li className="note-list-card" key={ note.id } onClick={ () => navigate(`/notes/${note.id}`) }>

            <div className="note-list-card__header">

                <div className="note-list-card__header-items">

                    <div className="note-list-card__header-item">
                        <div className="note-list-card__header-dot"></div>
                        <p className="note-list-card__header-text">
                            { note.createdAt ? format(note.createdAt.toDate(), "dd/MM/yyyy") : "Unknown Date" }
                        </p>
                    </div>

                </div>

                <div className="note-list-card__header-actions">

                    <button className="note-list-card__header-button note-list-card__header-button--fav" onClick={ (e) => e.stopPropagation() }>
                        <Star />
                    </button>

                    <button className="note-list-card__header-button note-list-card__header-button--delete" onClick={ (e) => { e.stopPropagation(); deleteNote(note.id); } }>
                        <Trash />
                    </button>

                </div>

            </div>

            <div className="note-list-card__content">
                <p className="note-list-card__content-title line-clamp-1">{ note.title }</p>
                <p className="note-list-card__content-description line-clamp-3">{ note.content }</p>
            </div>

        </li>
    );
};

export default NoteListCard;
