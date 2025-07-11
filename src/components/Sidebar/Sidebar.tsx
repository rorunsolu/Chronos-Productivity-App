import "@/components/Sidebar/Sidebar.scss";
import { UserAuth } from "@/contexts/authContext/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  FolderOpen,
  ChartColumnDecreasing,
  Notebook,
  SquareCheckBig,
} from "lucide-react";

const Sidebar: React.FC<SidebarProps> = ({ className, isSidebarExpanded }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("Home");

  const { user, logOut } = UserAuth();

  const handleSignOut = async () => {
    try {
      logOut();
    } catch (error) {
      throw new Error(`Error signing out: ${error}`);
    }
  };

  return (
    <aside
      className={`
                sidebar  transition-all
                ${isSidebarExpanded ? "w-66" : "w-16"} 
                ${user ? "" : "hidden"} 
                ${className || ""}
            `}
    >
      <nav className="sidebar__nav">
        <div
          className={`sidebar__header ${
            isSidebarExpanded ? "justify-start" : ""
          }`}
        >
          <img className={`sidebar__logo`} src="chronos-logo.svg" />
          <p
            className={`sidebar__logo-text ${
              isSidebarExpanded ? "" : "hidden"
            } `}
          >
            Chronos
          </p>
        </div>

        <ul className="sidebar__list">
          {sidebarItemList.map(({ name, icon }) => (
            <Link className="" to={`/${name}`} key={name}>
              <li
                className={`sidebar-item group
                        ${activeMenuItem === name ? "sidebar-item--active" : ""}
                        ${isSidebarExpanded ? "" : ""}`}
                onClick={() => setActiveMenuItem(name)}
              >
                <span
                  className={`sidebar-item__icon ${
                    isSidebarExpanded ? "ml-1.25" : "ml-1.25"
                  }`}
                >
                  {icon}
                </span>

                <span
                  className={`sidebar-item__text overflow-hidden capitalize ${
                    isSidebarExpanded ? "" : "hidden"
                  }`}
                >
                  {name}
                </span>

                {!isSidebarExpanded && (
                  <div
                    className={`sidebar-item__tooltip 
                              invisible opacity-20 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
                  >
                    {name}
                  </div>
                )}
              </li>
            </Link>
          ))}
        </ul>

        <div
          className="sidebar__footer"
          onClick={() => setIsUserMenuOpen((prevState) => !prevState)}
        >
          <div className="sidebar__user-container">
            {user?.photoURL ? (
              <img className="sidebar__avatar" src={user.photoURL} />
            ) : (
              <img className="sidebar__avatar" src="./placeholder.png" />
            )}

            <div
              className={`sidebar__user ${
                isSidebarExpanded ? "w-full" : "w-0"
              }`}
            >
              {user?.displayName ? (
                <div className="sidebar__user-info">
                  <h4 className="sidebar__user-name line-clamp-1">
                    {user.displayName}
                  </h4>
                  <span className="sidebar__user-email line-clamp-1">
                    {user.email}
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>

            {isUserMenuOpen && (
              <div className="sidebar__user-menu">
                <button
                  className="sidebar__user-button"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

const sidebarItemList = [
  { name: "Dashboard", icon: <ChartColumnDecreasing /> },
  { name: "Tasks", icon: <SquareCheckBig /> },
  { name: "Notes", icon: <Notebook /> },
  { name: "Projects", hasSubMenu: true, icon: <Layers /> },
  { name: "Folders", icon: <FolderOpen /> },
  // { name: "Calendar", icon: <Calendar /> },
];

interface SidebarProps {
  className?: string;
  isSidebarExpanded: boolean;
}
