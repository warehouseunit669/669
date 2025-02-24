import React, { useState, useEffect, useContext } from "react";
import hamburgerTopBarIcon from "../assets/hamburger-logo.svg";
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/joy/IconButton';
import AuthContext from "../AuthContext";
import Tooltip from "@mui/joy/Tooltip";
import Avatar from "@mui/joy/Avatar";
import "../css/topbar.css";

export default function TopBar(props) {
    // Check if the user is authenticated.
    const { user, logout } = useContext(AuthContext);
    const [isToggled, setIsToggled] = useState(window.innerWidth <= 767); // Initial check

    async function handleLogout() {
        // Logout the user
        await logout();
        try {
            navigate("/login");
        } catch (error) {
            console.error("Error during logout: ", error);
        }
    }

    useEffect(() => {
        function handleResize() {
            setIsToggled(window.innerWidth <= 767);
        }
        window.addEventListener("resize", handleResize);

        // Clean up
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const navbar = document.getElementById("accordionSidebar");
        if (navbar) {
            if (isToggled) {
                navbar.classList.add("toggled");
            } else {
                navbar.classList.remove("toggled");
            }
        }
    }, [isToggled]);

    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            {/* <!-- Topbar Navbar --> */}
            <ul className="navbar-nav">
                {/* <!-- Nav Item - User Information --> */}
                <li className="nav-item">
                    {/* <Dropdown >
                        <MenuButton>{user.username}</MenuButton>
                        <Menu>
                            <MenuItem></MenuItem>
                            <MenuItem>My account</MenuItem>
                            <MenuItem>Logout</MenuItem>
                        </Menu>
                    </Dropdown> */}
                    <a className="nav-link" href="#" id="userDropdown">
                        <Tooltip title="רמת הרשאות" variant="solid">
                            <Avatar color="primary">{user.role}</Avatar>
                        </Tooltip>
                        <IconButton onClick={handleLogout} variant="plain" className="ml-4">
                            <LogoutIcon />
                        </IconButton>
                        <span
                            className="ml-4 d-none d-lg-inline text-gray-600 small"
                            id="topbar-username"
                        >
                            {user.username}
                        </span>
                    </a>
                </li>
                <div className="topbar-divider d-none d-sm-block"></div>
            </ul>
            <div
                className="mr-3 ml-auto text-right pt-1"
                id="topbar-title-hamburger"
            >
                <span id="topbar-title">{props.title}</span>
                <button
                    id="toggle-sidebar"
                    className={window.innerWidth <= 767 ? "" : "invisible"}
                    onClick={() => setIsToggled(!isToggled)}
                    type="button"
                    data-toggle="toggled"
                    data-target="#accordionSidebar"
                    aria-label="Toggle navigation"
                >
                    <img
                        src={hamburgerTopBarIcon}
                        alt="hamburger logo"
                        id="hamburger-icon-navbar"
                    />
                </button>
            </div>
        </nav>
    );
}
