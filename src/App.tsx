import "@/App.css";
import Protected from "@/components/auth/Protected";
import Sidebar from "@/components/Sidebar/Sidebar";
import "@/Style.scss";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.css";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import NavigationBar from "@/components/Navigation Bar/NavigationBar";
import SignIn from "@/pages/Sign In Page/SignInPage";
import SignUp from "@/pages/Sign Up Page/SignUpPage";
import Homepage from "@/pages/Home Page/HomePage";
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
    <MantineProvider defaultColorScheme="light">
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
          <Routes>
            <Route path="/" element={<Homepage />} />
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
        </main>
      </div>
    </MantineProvider>
  );
}

export default App;
