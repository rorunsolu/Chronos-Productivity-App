import "./Navbar.scss";
import { Link } from 'react-router-dom';
import { UserAuth } from '../../contexts/authContext/AuthContext';

const Navbar = () => {
    const { user, logOut } = UserAuth();

    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {user ? null : (
                <nav className="navbar">

                    <div className="navbar__inner">

                        <div className="navbar__content">

                            <div className="navbar__logo">
                                <img className="logo" src="/chronos-logo.svg" alt="Chronos Logo" />
                                <span className="navbar__brand">Chronos</span>
                            </div>

                        </div>

                        <div className="navbar__actions">

                            <Link to="/SignIn">
                                <button className="navbar__actions-btn">Sign in</button>
                            </Link>

                            <Link to="/SignUp">
                                <button className="navbar__actions-btn">Sign up</button>
                            </Link>

                        </div>


                    </div>

                </nav>
            )}
        </>
    );
};

export default Navbar;
