import { UserAuth } from "@/contexts/authContext/AuthContext";
import { LogOut } from "lucide-react";
import "@/components/Navbar Menu/NavbarMenu.scss";

const NavbarMenu: React.FC<NavbarMenuProps> = ({ setIsMenuOpen }) => {
  const { user, logOut } = UserAuth();

  const handleSignOut = async () => {
    try {
      logOut();
    } catch (error) {
      throw new Error(`Error signing out: ${error}`);
    }
  };

  return (
    <>
      {user && (
        <div className="navbar-menu" onBlur={() => setIsMenuOpen(false)}>
          <div className="navbar-menu__info">
            <div className="navbar-menu__avatar-container">
              {user.photoURL ? (
                <img
                  className="navbar-menu__avatar"
                  src={user.photoURL}
                  alt="User Avatar"
                />
              ) : (
                ""
              )}
            </div>
            <div className="navbar-menu__details">
              <p className="navbar-menu__name line-clamp-1">
                {user.displayName}
              </p>
              <p className="navbar-menu__email line-clamp-1">{user.email}</p>
            </div>
          </div>

          <div className="navbar-menu__links">
            <button className="navbar-menu__link" onClick={handleSignOut}>
              <LogOut size={18} /> Sign out
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarMenu;

interface NavbarMenuProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
