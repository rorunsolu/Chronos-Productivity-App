import { useEffect, useState } from "react";
import { UserAuth } from '../../contexts/authContext/AuthContext';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { googleSignIn, emailSignIn, user } = UserAuth();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();

    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailSignIn = async (event) => {

    event.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      await emailSignIn(email, password);
    } catch (error) {
      console.log(error);
      setError("Failed to sign in. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

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
          <button className="signup-btn" type="submit" onClick={handleEmailSignIn}>Sign in</button>
          <button className="social-btn" type="button"> <img src="/google-logo.svg" alt="Google Logo" onClick={handleGoogleSignIn} />Sign in with Google</button>
        </div>

      </div>

      <div className="footer">
        <p className="text-sm-regular">Don't have an account?
          <Link to="/SignUp" className="alternative-btn">Sign up</Link>
        </p>
        <p className="text-sm-regular">Don't want to sign up?
          <Link to="/" className="alternative-btn">Go back to home</Link>
        </p>
      </div>

    </div>
  );
};

export default SignIn;
