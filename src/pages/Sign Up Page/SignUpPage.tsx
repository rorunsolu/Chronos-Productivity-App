import { useState, useEffect } from "react";
import { UserAuth } from "../../contexts/authContext/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.scss";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { googleSignIn, emailSignUp, user } = UserAuth();

  const handleGoogleSignUp = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      await emailSignUp(email, password);
    } catch (error) {
      console.log(error);
      setError("Failed to sign up. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="section">
      <div className="signuppage">
        <form className="signin-form" onSubmit={handleEmailSignUp}>
          <div className="signin-form__header">
            <h2 className="signin-form__title">Sign up</h2>
            <p className="signin-form__subtitle">
              Enter your email below to sign up for an account
            </p>
          </div>

          <div className="signin-form__group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="signin-form__group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="signin-form__buttons">
            <button className="signin-form__button" type="submit">
              Sign up
            </button>
            <button
              className="signin-form__google"
              type="button"
              onClick={handleGoogleSignUp}
            >
              Sign up with Google
            </button>
          </div>

          <p className="signin-form__signup">
            Already have an account?<Link to="/signin">Sign in</Link>
          </p>
          <p className="signin-form__signup">
            Don't want to sign in?<Link to="/">Go back to home</Link>
          </p>
        </form>

        {error && <p className="signuppage__error">{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
