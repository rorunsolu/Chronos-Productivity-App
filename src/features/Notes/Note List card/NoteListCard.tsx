import { NoteData } from "@/features/Notes/context/NoteContext";
import { useNavigate } from "react-router-dom";
import "@/features/Notes/Note List card/NoteListCard.scss";
import { Trash, Folder, Tag } from "lucide-react";
import DOMPurify from "dompurify";
import { useEffect } from "react";
import { UseFolders } from "@/features/Folders/context/FolderContext";
import InfoPill from "@/components/Info Pill/InfoPill";

const NoteListCard: React.FC<NoteListCard> = ({ note, deleteNote }) => {

    const { folders, fetchFolders } = UseFolders();

    useEffect(() => {
        fetchFolders();
    }, [fetchFolders]);

    const navigate = useNavigate();

    const htmlToPlainText = (html: string) => {
        const cleanHtml = DOMPurify.sanitize(html);
        const doc = new DOMParser().parseFromString(cleanHtml, "text/html");
        return doc.body.textContent || "";
    };

    const plainContent = htmlToPlainText(note.content);
    const folderName = folders.find(folder => folder.id === note.folder)?.name;

    return (
        <li className="note-list-card" key={ note.id } onClick={ () => navigate(`/notes/${note.id}`) }>

            <div className="note-list-card__header">

                <div className="note-list-card__header-items">

                    { folderName && (
                        <InfoPill icon={ <Folder size={ 13 } /> } value={ folderName } />
                    ) }

                    { note.label && (
                        <InfoPill icon={ <Tag size={ 13 } /> } value={ note.label } />
                    ) }

                </div>

                <div className="note-list-card__header-actions">

                    <button className="note-list-card__header-button" onClick={ (e) => { e.stopPropagation(); deleteNote(note.id); } }>
                        <Trash />
                    </button>

                </div>

            </div>

            <div className="note-list-card__content">
                <p className="note-list-card__content-description line-clamp-3">
                    { plainContent }
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