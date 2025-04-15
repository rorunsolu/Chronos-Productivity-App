import "@/App.css";
import Protected from "@/components/auth/Protected";
import NavigationBar from "@/components/Navigation Bar/NavigationBar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { AuthContextProvider } from "@/contexts/authContext/AuthContext";
import { FolderProvider } from "@/features/Folders/context/FolderContext";
import { NoteProvider } from "@/features/Notes/context/NoteContext";
import { ProjectsProvider } from "@/features/Projects/context/ProjectContext";
import { TaskProvider } from "@/features/Tasks/context/TaskContext";
import "@/Style.scss";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import SignIn from "@/pages/Sign In Page/SignInPage";
import SignUp from "@/pages/Sign Up Page/SignUpPage";
import Home from "@/pages/Home Page/HomePage";
import Dashboard from "@/pages/Dashboard Page/DashboardPage";
import TaskPage from "@/pages/Task List Page/TaskListPage";
import NotesPage from "@/pages/Note List Page/NoteListPage";
import NoteEditPage from "@/pages/Note Edit Page/NoteEditPage";
import TaskEditPage from "@/pages/Task Edit Page/TaskEditPage";
import ProjectsPage from "@/pages/Project List Page/ProjectListPage";
import ProjectEditPage from "@/pages/Project Edit Page/ProjectEditPage";
import FolderEditPage from "@/pages/Folder Edit Page/FolderEditPage";
import FolderListPage from "@/pages/Folder List Page/FolderListPage";
import MobileSidebar from "@/components/Mobile Sidebar/MobileSidebar";

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileSidebarExpanded, setIsMobileSidebarExpanded] = useState(false);

  return (
    <AuthContextProvider>
      <div className="app-layout">
        <Sidebar
          className="app-layout__sidebar"
          isSidebarExpanded={isSidebarExpanded}
        />
        <MobileSidebar
          isMobileSidebarExpanded={isMobileSidebarExpanded}
          setIsMobileSidebarExpanded={setIsMobileSidebarExpanded}
        />
        <NavigationBar
          className="app-layout__navbar"
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isMobileSidebarExpanded={isMobileSidebarExpanded}
          setIsMobileSidebarExpanded={setIsMobileSidebarExpanded}
        />
        <main className="app-layout__main">
          <FolderProvider>
            <ProjectsProvider>
              <NoteProvider>
                <TaskProvider>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route
                      path="/dashboard"
                      element={
                        <Protected allowGuest>
                          <Dashboard />
                        </Protected>
                      }
                    />
                    <Route
                      path="/tasks"
                      element={
                        <Protected allowGuest>
                          <TaskPage />
                        </Protected>
                      }
                    />
                    <Route
                      path="/tasks/:id"
                      element={
                        <Protected allowGuest>
                          <TaskEditPage />
                        </Protected>
                      }
                    />
                    <Route
                      path="/notes"
                      element={
                        <Protected allowGuest>
                          <NotesPage />
                        </Protected>
                      }
                    />
                    <Route
                      path="/notes/:id"
                      element={
                        <Protected allowGuest>
                          <NoteEditPage />
                        </Protected>
                      }
                    />
                    <Route
                      path="/projects"
                      element={
                        <Protected allowGuest>
                          <ProjectsPage />
                        </Protected>
                      }
                    />
                    <Route
                      path="/projects/:id"
                      element={
                        <Protected allowGuest>
                          <ProjectEditPage />
                        </Protected>
                      }
                    />
                    <Route
                      path="/folders"
                      element={
                        <Protected allowGuest>
                          <FolderListPage />
                        </Protected>
                      }
                    />
                    <Route
                      path="/folders/:id"
                      element={
                        <Protected allowGuest>
                          <FolderEditPage />
                        </Protected>
                      }
                    />
                  </Routes>
                </TaskProvider>
              </NoteProvider>
            </ProjectsProvider>
          </FolderProvider>
        </main>
      </div>
    </AuthContextProvider>
  );
}

export default App;
