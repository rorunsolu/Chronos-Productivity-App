import Navbar from './components/navbar/Navbar';
import Protected from './components/auth/Protected';
import Sidebar from './components/layout/sidebar/Sidebar';
import { AuthContextProvider } from './contexts/authContext/AuthContext';
import { NoteProvider } from './features/Notes/context/NoteContext';
import { TaskProvider } from './features/Tasks/context/TaskContext';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import SignIn from "./pages/Sign In Page/SignInPage";
import SignUp from "./pages/Sign Up Page/SignUpPage";
import Home from "./pages/Home Page/HomePage";
import Dashboard from "./pages/Dashboard Page/DashboardPage";
import TaskPage from "../src/pages/Tasks Page/TaskPage";
import NotesPage from "./pages/Notes Page/NotesPage";
import NoteEditorPage from './pages/Note Editor Page/NoteEditorPage';

function App() {

  return (
    <>
      <AuthContextProvider>
        <Navbar />
        <Sidebar />
        <NoteProvider>
          <TaskProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/dashboard" element={
                <Protected>
                  <Dashboard />
                </Protected>}
              />
              <Route path="/tasks" element={
                <Protected>
                  <TaskPage />
                </Protected>}
              />
              <Route path="/notes" element={
                <Protected>
                  <NotesPage />
                </Protected>}
              />
              <Route path="/notes/:id" element={
                <Protected>
                  <NoteEditorPage />
                </Protected>}
              />
            </Routes>
          </TaskProvider>
        </NoteProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
