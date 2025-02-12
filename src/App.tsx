import SignIn from "./pages/login/SignIn";
import SignUp from "./pages/register/SignUp";
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import Dashboard from "./pages/dashboard/Dashboard";
import Protected from "./components/auth/Protected";
import { Routes, Route } from "react-router-dom";
import './App.css';
import { AuthContextProvider } from "./contexts/authContext/AuthContext";

function App() {

  return (
    <>
      <AuthContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={
            <Protected>
              <Dashboard />
            </Protected>}
          />
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
