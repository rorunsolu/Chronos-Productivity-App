import React from 'react';
import Note from './Note';
import { notePageSectionProps } from "../../../common/types";

const NotePageSection: React.FC<notePageSectionProps> = ({ notes, deleteNote }) => {
    return (
        <div className="notepage__section">

            <ul className="notepage__note-list">
                {notes.map((note) => (
                    <Note key={note.id} note={note} deleteNote={deleteNote} />
                ))}
            </ul>

        </div>
    );
};

export default NotePageSection;
