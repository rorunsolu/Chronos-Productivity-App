import {
  // Calendar,
  ChartColumnDecreasing,
  FolderOpen,
  Layers,
  Notebook,
  SquareCheckBig,
  PanelLeftClose,
} from "lucide-react";
import "@/components/Mobile Sidebar/MobileSidebar.scss";
import MobileSidebarLink from "@/components/Mobile Sidebar Link/MobileSidebarLink";

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isMobileSidebarExpanded,
  setIsMobileSidebarExpanded,
}) => {
  return (
    <>
      {isMobileSidebarExpanded && (
        <div
          className="mobile-sidebar__backdrop"
          onClick={() => setIsMobileSidebarExpanded(false)}
        ></div>
      )}
      <aside
        className={`mobile-sidebar transition-all ${
          isMobileSidebarExpanded ? "w-66 translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mobile-sidebar__header">
          <div className="mobile-sidebar__logo-container">
            <img className="mobile-sidebar__logo" src="chronos-logo.svg" />
            <p
              className={`mobile-sidebar__logo-text ${
                isMobileSidebarExpanded
                  ? ""
                  : "mobile-sidebar__logo-text--hidden"
              }`}
            >
              Chronos
            </p>
          </div>

          <button
            className="sidebar-toggler-mobile-close"
            onClick={() => setIsMobileSidebarExpanded(false)}
          >
            <PanelLeftClose />
          </button>
        </div>

        <ul className="mobile-sidebar__list">
          {mobileSidebarLinks.map(({ name, icon }, index) => (
            <MobileSidebarLink
              key={index}
              name={name}
              icon={icon}
              onClick={() => setIsMobileSidebarExpanded(false)}
            />
          ))}
        </ul>
      </aside>
    </>
  );
};

export default MobileSidebar;

const mobileSidebarLinks = [
  { name: "Dashboard", icon: <ChartColumnDecreasing /> },
  { name: "Tasks", icon: <SquareCheckBig /> },
  { name: "Notes", icon: <Notebook /> },
  { name: "Projects", hasSubMenu: true, icon: <Layers /> },
  { name: "Folders", icon: <FolderOpen /> },
  // { name: "Calendar", icon: <Calendar /> },
];

interface MobileSidebarProps {
  isMobileSidebarExpanded: boolean;
  setIsMobileSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}
