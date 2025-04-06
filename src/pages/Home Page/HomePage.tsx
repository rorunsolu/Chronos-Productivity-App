import "@/pages/Home Page/HomePage.scss";
import { Link } from "react-router-dom";
import { UserAuth } from "@/contexts/authContext/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const { signInAsGuest, user } = UserAuth();
  const [error, setError] = useState("");

  const handleGuestAccess = async () => {
    try {
      await signInAsGuest();
      navigate("/dashboard");
    } catch (error) {
      console.error("Guest access failed:", error);
      setError("Failed to sign in as guest. Please try again.");
    }
  };

  return (
    <div className="page-wrapper page-wrapper--home">

      <div className="homepage">

        <header className="homepage__header">

          <img className="homepage__logo" src="/chronos-logo.svg" alt="Chronos Logo" />

          <div className="homepage__header-content">
            <h1 className="homepage__title">Welcome to Chronos</h1>
            <p className="homepage__subtitle">Your time management companion</p>
          </div>

        </header>

        { !user && (
          <div className="homepage__actions">

            <div className="homepage__button-wrapper">
              <Link to="/SignIn">
                <button className="homepage__button">Sign in to your account</button>
              </Link>
              <Link to="/SignUp">
                <button className="homepage__button">Create an account</button>
              </Link>
              <button className="homepage__button homepage__button--secondary" onClick={ handleGuestAccess }>Start without an account</button>
            </div>

          </div>
        ) }

        { error && <p className="signuppage__error">{ error }</p> }

      </div>
    </div>
  );
};

export default Home;
