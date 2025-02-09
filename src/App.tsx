import SignIn from "./components/auth/login/SignIn";
import SignUp from "./components/auth/register/SignUp";
import { Routes, Route } from "react-router-dom";
import './App.css';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  );
}

export default App;
