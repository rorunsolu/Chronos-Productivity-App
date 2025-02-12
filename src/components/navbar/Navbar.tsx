import './Navbar.css';
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
        <nav className="navbar">

            <div className="navbar__logo">
                <img className="logo" src="/chronos-logo.svg" alt="Chronos Logo" />
                <span className="navbar__brand">Chronos</span>
            </div>

            {user ?

                <div className="navbar__actions">
                    <button className="navbar__button navbar__button--signin" onClick={handleSignOut}>Log out</button>
                </div>

                :

                <div className="navbar__actions">

                    <Link to="/SignIn">
                        <button className="navbar__button navbar__button--signin">Sign in</button>
                    </Link>
                    <Link to="/SignUp">
                        <button className="navbar__button navbar__button--signup">Sign up</button>
                    </Link>

                </div>
            }

        </nav>
    );
};

export default Navbar;
