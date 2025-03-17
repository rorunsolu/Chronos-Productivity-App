import Navbar from "@/components/Navbar/Navbar";
import Protected from "@/components/auth/Protected";
import Sidebar from "@/components/Sidebar/Sidebar";
import { AuthContextProvider } from "@/contexts/authContext/AuthContext";
import { NoteProvider } from "@/features/Notes/context/NoteContext";
import { ProjectsProvider } from "@/features/Projects/context/ProjectContext";
import { Route, Routes } from "react-router-dom";
import { TaskProvider } from "@/features/Tasks/context/TaskContext";
import "@/App.css";
import SignIn from "@/pages/Sign In Page/SignInPage";
import SignUp from "@/pages/Sign Up Page/SignUpPage";
import Home from "@/pages/Home Page/HomePage";
import Dashboard from "@/pages/Dashboard Page/DashboardPage";
import TaskPage from "@/pages/Tasks Page/TaskPage";
import NotesPage from "@/pages/Note List Page/NoteListPage";
import NoteEditorPage from '@/pages/Note Editor Page/NoteEditorPage';
import TaskEditPage from "@/pages/Task Edit Page/TaskEditPage";
import ProjectsPage from '@/pages/Project List Page/ProjectListPage';
import ProjectEditingPage from '@/pages/Project Editing Page/ProjectEditingPage';

function App() {

   return (
      <AuthContextProvider>

         <Sidebar />
         <Navbar />

         <ProjectsProvider>
            <NoteProvider>
               <TaskProvider>
                  <Routes>
                     <Route path="/" element={ <Home /> } />
                     <Route path="/signup" element={ <SignUp /> } />
                     <Route path="/signin" element={ <SignIn /> } />
                     <Route path="/dashboard" element={
                        <Protected>
                           <Dashboard />
                        </Protected>
                     } />
                     <Route path="/tasks" element={
                        <Protected>
                           <TaskPage />
                        </Protected>
                     } />
                     <Route path="/notes" element={
                        <Protected>
                           <NotesPage />
                        </Protected>
                     } />
                     <Route path="/notes/:id" element={
                        <Protected>
                           <NoteEditorPage />
                        </Protected>
                     } />
                     <Route path="/tasks/:id" element={
                        <Protected>
                           <TaskEditPage />
                        </Protected>
                     } />
                     <Route path="/projects" element={
                        <Protected>
                           <ProjectsPage />
                        </Protected>
                     } />
                     <Route path="/projects/:id" element={
                        <Protected>
                           <ProjectEditingPage />
                        </Protected>
                     } />
                  </Routes>
               </TaskProvider>
            </NoteProvider>
         </ProjectsProvider>
      </AuthContextProvider>
   );
}

export default App;
