import "@/components/Navbar/Navbar.scss";
import { UserAuth } from "@/contexts/authContext/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import NavbarLink from "@/components/Navbar Link/NavbarLink";
import { PanelLeftClose, PanelLeftOpen, Moon, Sun, User } from 'lucide-react';

const Navbar: React.FC<NavbarProps> = ({ className, isSidebarExpanded, setIsSidebarExpanded }) => {
    const { user, logOut } = UserAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDakModeOn, setIsDarkModeOn] = useState(false);

    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            { user ? <nav className={ `
         navbar 
         ${className || ""}
      `} >

                <div className="navbar__inner">

                    <div className="navbar__content">

                        <div className="navbar__logo">
                            <img className="logo" src="/chronos-logo.svg" alt="Chronos Logo" />
                            <span className="navbar__brand">Chronos</span>
                        </div>

                        <ul className="navbar__links">
                            { navLinks.map((page, index) => (
                                <NavbarLink key={ index } page={ page } />
                            )) }
                        </ul>

                        <button
                            className="sidebar-toggler"
                            onClick={ () => setIsSidebarExpanded((prevState) => !prevState) }
                        >
                            { isSidebarExpanded ? <PanelLeftClose /> : <PanelLeftOpen /> }
                        </button>

                    </div>
                    <div className="navbar__account" onClick={ () => setIsMenuOpen(prevState => !prevState) }>

                        <button
                            className="navbar__theme-btn"
                            onClick={ (e) => {
                                e.stopPropagation();
                                setIsDarkModeOn(prevState => !prevState);
                            } }
                        >
                            { isDakModeOn ? <Moon /> : <Sun /> }
                        </button>

                        <div className="navbar__account-avatar-container">
                            { user.photoURL ? (
                                <img className="navbar__account-avatar" src={ user.photoURL } />
                            ) : "" }
                        </div>

                        { isMenuOpen &&
                            (
                                <div className="navbar__account-menu">
                                    <button className="navbar__account-link" onClick={ handleSignOut }>Sign out</button>
                                </div>
                            )
                        }
                    </div>

                </div>

            </nav >
                : (
                    null

                ) }
        </>
    );
};

export default Navbar;

const navLinks = ["dashboard", "projects", "tasks", "notes", "folders"];

interface NavbarProps {
    className?: string;
    isSidebarExpanded: boolean;
    setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}