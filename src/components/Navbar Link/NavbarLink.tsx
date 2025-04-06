import "@/components/Navbar Link/NavbarLink.scss";
import { Link } from "react-router-dom";

const NavbarLink: React.FC<NavbarLinkProps> = ({ page }) => {
    return (
        <Link className="navbar-link" to={ `/${page}` }>
            { page }
        </Link>
    )
}

export default NavbarLink

interface NavbarLinkProps {
    page: string;
}