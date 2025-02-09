import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { Link } from "react-router-dom";
import "./SignIn.css";

const SignIn = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setError("Could not login user. Please try again.");
      console.error("Could not login user", error);
    }
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    loginWithEmail(email, password);
  };

  return (
    <div className="container">

      <div className="header">
        <img className="logo" src="/chronos-logo.svg" alt="Chronos Logo" />
        <h1 className="title display-xs-semibold">Sign in</h1>
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
          <button className="signup-btn" type="submit" onClick={handleSignIn}>Sign in</button>
          <button className="social-btn"> <img src="/google-logo.svg" alt="Google Logo" /> Sign in with Google</button>
        </div>

      </div>

      <div className="footer">
        <p className="text-sm-regular">Don't have an account?
          <Link to="/" className="alternative-btn">Sign up</Link>
        </p>
      </div>

    </div>
  );
};

export default SignIn;
