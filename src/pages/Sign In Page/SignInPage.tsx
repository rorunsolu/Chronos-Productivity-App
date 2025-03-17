import { useEffect, useState } from "react";
import { UserAuth } from '../../contexts/authContext/AuthContext';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./SignInPage.scss";

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
    <div className="flex w-full h-full justify-center items-center mt-16">

      <div className="signuppage">

        <form className="login-form">

          <div className="login-form__header">
            <h2 className="login-form__title">Login</h2>
            <p className="login-form__subtitle">Enter your email below to login to your account</p>
          </div>

          <div className="login-form__group">
            <label htmlFor="email">Email</label>
            <input type="email" placeholder="m@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
            <a href="#" className="login-form__forgot">Forgot your email?</a>
          </div>

          <div className="login-form__group">
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <a href="#" className="login-form__forgot">Forgot your password?</a>
          </div>

          <div className="login-form__buttons">
            <button className="login-form__button" type="submit" onClick={handleEmailSignIn}>Login</button>
            <button className="login-form__google" type="button" onClick={handleGoogleSignIn}>Login with Google</button>
          </div>

          <p className="login-form__signup">Don't have an account?<Link to="/signup">Sign up</Link></p>
          <p className="login-form__signup">Don't want to create an account?<Link to="/">Go back to home</Link></p>

        </form>

        {error && <p className="signuppage__error">{error}</p>}

      </div>

    </div>
  );
};

export default SignIn;
