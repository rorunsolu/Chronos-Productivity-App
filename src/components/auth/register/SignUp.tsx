import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { Link } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const registerWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setError("Could not register user. Please try again.");
      console.error("Could not register user", error);
    }
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    registerWithEmail(email, password);
  };

  return (
    <div className="container">

      <div className="header">
        <img className="logo" src="/chronos-logo.svg" alt="Chronos Logo" />
        <h1 className="title display-xs-semibold">Sign up</h1>
      </div>

      <div className="content">

        <div className="form">

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>

        </div>

        {error && <p className="error">{error}</p>}

        <div className="actions">
          <button className="signup-btn" type="submit" onClick={handleSignUp}>Sign up</button>
          <button className="social-btn"> <img src="/google-logo.svg" alt="Google Logo" /> Sign up with Google</button>
        </div>

      </div>

      <div className="footer">
        <p className="text-sm-regular">Already have an account?
          <Link to="/signin" className="alternative-btn">Sign in</Link>
        </p>
      </div>

    </div>
  );
};

export default SignUp;
