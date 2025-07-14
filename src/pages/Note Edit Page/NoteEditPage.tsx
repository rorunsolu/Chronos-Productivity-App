import { UserAuth } from "@/contexts/authContext/AuthContext";
import { UseFolders } from "@/features/Folders/context/FolderContext";
import { NoteData } from "@/features/Notes/context/NoteContext";
import { db } from "@/firebase/firebase";
import { Notification, Select, Stack, TextInput } from "@mantine/core";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FolderOpen, Tag } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import "@/pages/Note Edit Page/NoteEditPage.scss";
import { RichTextEditor } from "@/components/Rich Text Editor/RichTextEditor";
import InputHeader from "@/components/Input Header/InputHeader";

// Todo: Need to add a removal options for the dropdowns

const NoteEditPage = () => {
  const { user } = UserAuth();

  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [note, setNote] = useState<NoteData>();
  const [noteContent, setNoteContent] = useState("");
  const [noteFolder, setNoteFolder] = useState<string | null>("");
  const [noteLabel, setNoteLabel] = useState<string | null>("");
  const [noteTitle, setNoteTitle] = useState("");

  const { folders, fetchFolders, addNoteToFolder, removeNoteFromFolder } =
    UseFolders();
  const folderOptions = useMemo(
    () =>
      folders.map((folder) => ({
        folderID: folder.id,
        folderName: folder.name,
      })),
    [folders]
  );

  useEffect(() => {
    fetchFolders();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    const fetchNote = async () => {
      try {
        if (!id || !user) {
          console.log("Missing note ID or user authentication");
          setIsLoading(false);
          return;
        }

        const noteRef = doc(db, "notes", id);
        const noteSnapshot = await getDoc(noteRef);

        if (!noteSnapshot.exists()) {
          alert("This note could not be found");
          setIsLoading(false);
          return;
        }

        const noteData = noteSnapshot.data();
        if (noteData.userId !== user.uid) {
          alert("You don't have permission to access this note");
          setIsLoading(false);
          return;
        }

        const noteObjectData = noteSnapshot.data();

        setNoteTitle(noteObjectData.title || "");
        setNoteContent(noteObjectData.content || "");
        setNoteFolder(noteObjectData.folderID || "");
        setNoteLabel(noteObjectData.label || "");
        setNote(noteObjectData as NoteData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNote();
  }, [id, user, isInitialLoad]);

  const updateNoteInFirebase = useCallback(
    async (newTitle: string, newContent: string) => {
      try {
        if (!id || !user) return;

        await setDoc(
          doc(db, "notes", id),
          {
            title: newTitle,
            content: newContent,
            userId: user.uid,
          },
          { merge: true }
        );
      } catch (error) {
        throw new Error(`Error updating note: ${error}`);
      } finally {
        setIsLoading(false);
      }
    },
    [id, user]
  );

  const handleFolderChange = async (newFolderID: string | null) => {
    try {
      if (!id || !user) {
        throw new Error("User is not authenticated or note ID is missing");
      }

      if (note?.folderID) {
        removeNoteFromFolder(note.folderID, id);
      }

      await setDoc(
        doc(db, "notes", id),
        {
          folder: newFolderID || null,
          userId: user.uid,
        },
        { merge: true }
      );

      addNoteToFolder(newFolderID || "", id);

      setNote((prev) => (prev ? { ...prev, folder: newFolderID } : prev));
    } catch (error) {
      setNoteFolder(note?.folderID || "");
      alert("Failed to update folder assignment");
      throw error;
    }
  };

  useEffect(() => {
    const hasChanged =
      (noteContent.trim() !== "" && noteContent !== note?.content) ||
      (noteTitle.trim() !== "" && noteTitle !== note?.title) ||
      noteFolder !== note?.folderID;

    if (!hasChanged) return;

    setIsLoading(true);

    const getNoteData = setTimeout(() => {
      updateNoteInFirebase(noteTitle, noteContent);
    }, 1000);

    return () => clearTimeout(getNoteData);
  }, [note, noteTitle, noteContent, noteFolder, updateNoteInFirebase]);

  useEffect(() => {
    if (noteFolder === note?.folderID) return;

    const getNoteFolder = setTimeout(() => {
      handleFolderChange(noteFolder);
    }, 1000);

    return () => clearTimeout(getNoteFolder);
    // eslint-disable-next-line
  }, [note?.folderID, noteFolder]);

  return (
    <div className="page-wrapper">
      <div className="note-edit-page">
        <TextInput
          variant="unstyled"
          size="lg"
          placeholder="Input placeholder"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          mb={10}
        />

        <Stack gap={16}>
          <Stack gap={2} w="fit-content">
            <InputHeader label="Folder" icon={<FolderOpen size={16} />} />
            <Select
              placeholder="Select a folder"
              data={folderOptions.map((option) => option.folderName)}
              defaultValue={"Pending"}
              clearable
              value={
                folderOptions.find((option) => option.folderID === noteFolder)
                  ?.folderName || ""
              }
              onChange={(folderID) => {
                const selectedFolder = folders.find(
                  (folder) => folder.name === folderID
                );
                setNoteFolder(selectedFolder?.id || "");
              }}
              checkIconPosition="right"
            />
          </Stack>

          <Stack gap={2} w="fit-content">
            <InputHeader label="Label" icon={<Tag size={16} />} />
            <Select
              placeholder="Select a project"
              data={["Work", "Personal", "School"]}
              checkIconPosition="right"
              value={noteLabel}
              clearable
              onChange={(value) => {
                setNoteLabel(value || null);
              }}
            />
          </Stack>

          <div className="h-5">
            {isLoading && (
              <Notification
                loading
                withBorder
                color="teal"
                radius="8"
                title="Saving..."
                closeButtonProps={{ "aria-label": "Hide notification" }}
              ></Notification>
            )}
          </div>
        </Stack>

        <Stack mt={16}>
          <RichTextEditor value={noteContent} onChange={setNoteContent} />
        </Stack>
      </div>
    </div>
  );
};

export default NoteEditPage;
