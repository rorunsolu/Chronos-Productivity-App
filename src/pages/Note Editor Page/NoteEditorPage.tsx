import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from "../../firebase/firebase";
import { Notedata } from '../../features/Notes/context/NoteContext';
import "./NoteEditorPage.scss";
import { set } from 'date-fns';

const NoteEditorPage = () => {
    const { id } = useParams<{ id: string; }>(); // Get the notebook id from the URL
    const [note, setNote] = useState<Notedata>(); // State to store the content of a new note
    const [noteContent, setNoteContent] = useState(""); // State to store the content of a new note
    const [noteTitle, setNoteTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchNote = async () => {

            if (!id) {
              return;
            }

            const note = doc(db, "notes", id);
            const noteSnapshot = await getDoc(note);

            if (!noteSnapshot.exists()) {
                console.log("Note does not exist");
                setIsLoading(false);
                return;
            }

            const noteObjectData = noteSnapshot.data();
            setNoteContent(noteObjectData.content);
            setNoteTitle(noteObjectData.title);
            setNote(noteObjectData as Notedata);
            setIsLoading(false);
        };
        fetchNote();
    }, [id]);

    const updateNoteInFirebase = async (newTitle: string, newContent: string) => {
        try {
            if (!id) {
                return;
            }

            const note = doc(db, "notes", id);
            await setDoc(note, { title: newTitle, content: newContent }, { merge: true }); // merge: true will only update the content field

        } catch (error) {
            console.error("Error updating note:", error);
        } finally {
            setIsLoading(false);
            console.log("Note updated successfully");
        }
    };

    useEffect(() => {
        console.log("checking if note has changed, finna wait 1 second before updating in firebase");
        if (noteTitle === note?.title && noteContent === note?.content) {
            return; // returns if the BOTH the title and content havent changed
        }

        setIsLoading(true);
        const getData = setTimeout(() => {
            console.log("updating note in firebase");
            updateNoteInFirebase(noteTitle, noteContent);
        }, 1000);
        return () => clearTimeout(getData);
    }, [noteTitle, noteContent, note?.title, note?.content]);

    return (
        <form className="note-editor">
            <div className="note-editor__header">
                <input
                    className="note-editor__title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                />

                {isLoading && <div className="note-editor__loading-animation">
                    <p>Saving...</p>
                </div>}
            </div>

            <textarea className="note-editor__textarea"
                value={noteContent}
                onChange={(event) => setNoteContent(event.target.value)}
                // need to add rich text functionality
            />
        </form>
    );//! USE MIXIONS IN SCSS TO SAVE SPACE RAHHHHH
};

export default NoteEditorPage;

