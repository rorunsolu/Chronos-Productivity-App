import { UseNotes } from "@/features/Notes/context/NoteContext";
import { useEffect } from "react";
import DashSubHeader from "@/components/Dash Sub Header/DashSubHeader";
import DashNoteCard from "@/features/Notes/Dash Note Card/DashNoteCard";
import "@/features/Notes/Dash Note Block/DashNoteBlock.scss";

const DashNoteBlock = () => {
  const { notes, fetchNotes } = UseNotes();

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="dash-note-block">
      <div className="dash-note-block__top">
        <DashSubHeader title="Notes" count={notes.length} />
      </div>

      <div className="dash-note-block__bottom">
        <ul className="dash-note-block__list">
          {notes.map((note) => (
            <DashNoteCard note={note} key={note.id} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashNoteBlock;
