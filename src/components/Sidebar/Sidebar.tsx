import { ChevronFirst, ChevronLast } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { UserAuth } from "@/contexts/authContext/AuthContext";
import "@/components/Sidebar/Sidebar.scss";

const Sidebar = () => {
   const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
   const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");

   const { user, logOut } = UserAuth();

   const handleSignOut = async () => {
      try {
         await logOut();
      } catch (error) {
         console.log(error);
      }
   };

   return (

      <aside className={ `sidebar ${isSidebarExpanded ? "w-66 transition-all" : "w-16 transition-all"} ${user ? "" : "hidden"} ` }>
         <nav className="sidebar__nav">

            <div className="sidebar__header">
               <div className={ `sidebar__logo-container overflow-hidden ${isSidebarExpanded ? "w-52" : "w-0"}` }>
                  <img className={ `sidebar__logo w-8 ${isSidebarExpanded ? "" : " "}` } src="chronos-logo.svg" />
                  <p className={ `sidebar__logo-text ${isSidebarExpanded ? " " : ""} ` }>Chronos</p>
               </div>

               <button className="sidebar__toggle" onClick={ () => setIsSidebarExpanded(prevState => !prevState) }>
                  { isSidebarExpanded ? <ChevronFirst /> : <ChevronLast /> }
               </button>

            </div>

            <ul className="sidebar__list">
               { sidebarItemList.map(({ name, icon }) => (
                  <Link to={ `/${name}` } key={ name }>
                     <li
                        className={ `sidebar-item group
                        ${activeMenuItem === name ? "sidebar-item--active" : ""}
                        ${isSidebarExpanded ? "pl-3" : "pl-0"}` }
                        onClick={ () => setActiveMenuItem(name) }
                     >
                        { icon }

                        <span className={ `sidebar-item__text overflow-hidden capitalize ${isSidebarExpanded ? "w-52 ml-3" : "w-0 hidden"}` }>
                           { name }
                        </span>

                        { !isSidebarExpanded && (
                           <div className={ `sidebar-item__tooltip 
                              invisible opacity-20 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                              { name }
                           </div>
                        ) }
                     </li>
                  </Link>
               )) }
            </ul>

            <div className="sidebar__footer" onClick={ () => setIsUserMenuOpen(prevState => !prevState) }>

               <div className="sidebar__user-container">

                  { user?.photoURL ? (
                     <img className="sidebar__avatar" src={ user.photoURL } />
                  ) : (
                     <img className="sidebar__avatar" src="./placeholder.png" />
                  ) }

                  <div className={ `sidebar__user ${isSidebarExpanded ? "w-full" : "w-0"}` }>
                     { user?.displayName ? (
                        <div className="sidebar__user-info">
                           <h4 className="sidebar__user-name line-clamp-1">{ user.displayName }</h4>
                           <span className="sidebar__user-email line-clamp-1">{ user.email }</span>
                        </div>
                     ) : (
                        ""
                     ) }

                  </div>

                  { isUserMenuOpen && (
                     <div className="sidebar__user-menu">

                        <button className="sidebar__user-button" onClick={ handleSignOut }>
                           Sign Out
                        </button>

                     </div>
                  ) }

               </div>

            </div>

         </nav>
      </aside>
   );
};

export default Sidebar;

const sidebarItemList = [
   { name: "Dashboard", icon: <i className="ri-dashboard-line"></i> },
   { name: "Tasks", icon: <i className="ri-task-line"></i> },
   { name: "Notes", icon: <i className="ri-booklet-line"></i> },
   { name: "Projects", hasSubMenu: true, icon: <i className="ri-briefcase-line"></i> },
   { name: "Folders", icon: <i className="ri-folder-line"></i> },
];