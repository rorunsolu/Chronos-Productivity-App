import App from "@/App";
import { AuthContextProvider } from "@/contexts/authContext/AuthContext";
import { FolderProvider } from "@/features/Folders/context/FolderContext";
import { NoteProvider } from "@/features/Notes/context/NoteContext";
import { ProjectsProvider } from "@/features/Projects/context/ProjectContext";
import { TaskProvider } from "@/features/Tasks/context/TaskContext";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root") as HTMLElement;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthContextProvider>
        <FolderProvider>
          <NoteProvider>
            <ProjectsProvider>
              <TaskProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </TaskProvider>
            </ProjectsProvider>
          </NoteProvider>
        </FolderProvider>
      </AuthContextProvider>
    </StrictMode>
  );
}
