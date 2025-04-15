import "@/components/Navigation Bar/NavigationBar.scss";
import { UserAuth } from "@/contexts/authContext/AuthContext";
import { Moon, PanelLeftClose, PanelLeftOpen, Sun } from "lucide-react";
import { useState } from "react";
import NavbarLink from "@/components/Navbar Link/NavbarLink";
import NavbarMenu from "@/components/Navbar Menu/NavbarMenu";

const NavigationBar: React.FC<NavbarProps> = ({
  className,
  setIsSidebarExpanded,
  isMobileSidebarExpanded,
  setIsMobileSidebarExpanded,
}) => {
  const { user } = UserAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDakModeOn, setIsDarkModeOn] = useState(false);

  return (
    <>
      {user ? (
        <nav
          className={`
         navbar 
         ${className || ""}
      `}
        >
          <div className="navbar__inner">
            <div className="navbar__content">
              <div className="navbar__logo">
                <img
                  className="logo"
                  src="/chronos-logo.svg"
                  alt="Chronos Logo"
                />
                <span className="navbar__brand">Chronos</span>
              </div>

              <ul className="navbar__links">
                {navLinks.map((page, index) => (
                  <NavbarLink key={index} page={page} />
                ))}
              </ul>

              <button
                className="sidebar-toggler"
                onClick={() => setIsSidebarExpanded((prevState) => !prevState)}
              >
                <PanelLeftOpen />
              </button>

              <button
                className="sidebar-toggler-mobile-open"
                onClick={() => setIsMobileSidebarExpanded(true)}
              >
                {isMobileSidebarExpanded ? (
                  <PanelLeftClose />
                ) : (
                  <PanelLeftOpen />
                )}
              </button>
            </div>

            <div
              className="navbar__account"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((prevState) => !prevState);
              }}
            >
              <button
                className="navbar__theme-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDarkModeOn((prevState) => !prevState);
                }}
              >
                {isDakModeOn ? <Moon /> : <Sun />}
              </button>

              <div className="navbar__account-avatar-container">
                {user.photoURL ? (
                  <img className="navbar__account-avatar" src={user.photoURL} />
                ) : (
                  ""
                )}
              </div>

              {isMenuOpen && <NavbarMenu setIsMenuOpen={setIsMenuOpen} />}
            </div>
          </div>
        </nav>
      ) : null}
    </>
  );
};

export default NavigationBar;

const navLinks = ["dashboard", "projects", "tasks", "notes", "folders"];

interface NavbarProps {
  className?: string;
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileSidebarExpanded: boolean;
  setIsMobileSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}
