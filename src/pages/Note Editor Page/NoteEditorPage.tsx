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
    const [input, setInput] = useState(""); // State to store the content of a new note
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchNote = async () => {

            if (!id) return;

            const note = doc(db, "notes", id);
            const noteSnapshot = await getDoc(note);

            if (!noteSnapshot.exists()) {
                console.log("Note does not exist");
                setIsLoading(false);
                return;
            }

            const noteObjectData = noteSnapshot.data();
            setInput(noteObjectData.content);
            setNote(noteObjectData as Notedata);
            setIsLoading(false);
        };
    }, [id]);

    const updateNoteInFirebase = async (newContent: string) => {
        try {
            if (!id) return;

            const note = doc(db, "notes", id);
            await setDoc(note, { content: newContent }, { merge: true }); // merge: true will only update the content field

        } catch (error) {
            console.error("Error updating note:", error);
        } finally {
            setIsLoading(false);
            console.log("Note updated successfully");
        }
    };

    useEffect(() => {
        console.log("checking if note has changed, finna wait 1 second before updating in firebase");
        if (input === note?.content) return;

        setIsLoading(true);
        const getData = setTimeout(() => {
            console.log("updating note in firebase");
            updateNoteInFirebase(input);
        }, 1000);
        return () => clearTimeout(getData);
    }, [input, note?.content]);

    return (
        <div className="note-editor">
            <div className="note-editor__header">
                {!isLoading && <h1 className="note-editor__title">{note?.title ?? "Notes"}</h1>}
                {isLoading && <div className="note-editor__loading-animation">
                    <p>Saving...</p>
                </div>}
            </div>
            <textarea className="note-editor__textarea"
                // need to add rich text functionality
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="What's on your mind?"
            />
        </div>
    );
};

export default NoteEditorPage;
