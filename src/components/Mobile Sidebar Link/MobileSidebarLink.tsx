import { Link } from "react-router-dom";
import { useState } from "react";
import "@/components/Mobile Sidebar Link/MobileSidebarLink.scss";

const MobileSidebarLink: React.FC<MobileSidebarLinkProps> = ({
  name,
  icon,
  onClick,
  setIsMobileSidebarExpanded,
}) => {
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");

  return (
    <Link
      className={`mobile-sidebar-link ${
        activeMenuItem === name ? "mobile-sidebar-link--active" : ""
      }`}
      to={`/${name}`}
      onClick={() => {
        setActiveMenuItem(name);
        setIsMobileSidebarExpanded?.(false);
        onClick?.();
      }}
    >
      <span className="mobile-sidebar-link__icon">{icon}</span>
      <span className="mobile-sidebar-link__text">{name}</span>
    </Link>
  );
};

export default MobileSidebarLink;

interface MobileSidebarLinkProps {
  name: string;
  icon: React.ReactNode;
  onClick?: () => void;
  setIsMobileSidebarExpanded?: (isOpen: boolean) => void;
}
