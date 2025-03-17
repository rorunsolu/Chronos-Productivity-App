import "./HomePage.scss";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex w-full h-full justify-center items-center mt-16">

      <div className="homepage">

        <div className="homepage__actions">

          {/* <div className="homepage__actions-primary">

            <button className="homepage__social-btn" type="button">Start without an account</button>

          </div> */}

        </div>

        <div className="homepage__nav">

          {/* <Link to="/SignIn">
            <button className="homepage__nav-btn">Sign in</button>
          </Link>

          <Link to="/SignUp">
            <button className="homepage__nav-btn">Sign up</button>
          </Link> */}

        </div>

      </div>
    </div>
  );
};

export default Home;
