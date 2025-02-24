import React, { useState, useEffect, useContext } from "react";
import heartSidebarSvg from "../assets/heart.svg"
import syringeSideBarSvg from "../assets/syringe-logo.svg"
import medicalBagSideBarSvg from "../assets/bag-logo.svg"
import pillsSideBarSvg from "../assets/pills-logo.svg"
import listSidebarSvg from "../assets/list-logo.svg"
import pieChartSidebarSvg from "../assets/pie-chart-logo.svg"
import userSidebarSvg from "../assets/user-logo.svg"
import AuthContext from "../AuthContext";
import "../css/sidebar.css";

export default function SideBar() {
    const [isToggled, setIsToggled] = useState(window.innerWidth <= 767); // Initial check
    const { user } = useContext(AuthContext);

    useEffect(() => {
        function handleResize() {
            setIsToggled(window.innerWidth <= 767);
        }

        window.addEventListener("resize", handleResize);

        // Clean up
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const sidebarClass = `navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ${isToggled ? "toggled" : ""}`;

    return (
        <ul className={sidebarClass} id="accordionSidebar">
            {/* Sidebar - Brand */}
            <a
                className="sidebar-brand d-flex align-items-center justify-content-center"
                href="/"
            >
                <div className="sidebar-brand-text mx-3 text-right">
                    ניהול רפואי
                </div>
                <img
                    alt="heart sidebar svg"
                    src={heartSidebarSvg}
                    width="30vh"
                />
            </a>

            {/* Divider */}
            <hr className="sidebar-divider" />

            {/* Heading */}
            <NavMiniHeader text="ניהול" />

            <NavItem
                url="/equipment"
                text="FIFO - ניהול ציוד"
                alt="syringe sidebar svg"
                src={syringeSideBarSvg}
            />

            <NavItem
                url="/files"
                text="ניהול תיקים"
                alt="medical bag sidebar svg"
                src={medicalBagSideBarSvg}
            />

            <NavItem
                url="/makatim"
                text='ניהול מק"טים'
                alt="pills sidebar svg"
                src={pillsSideBarSvg}
            />

            {/* Divider */}
            <hr className="sidebar-divider" />

            {/* Heading */}
            <NavMiniHeader text="מעקב" />

            <NavItem
                url="/missions"
                text="מעקב משימות"
                alt="list sidebar svg"
                src={listSidebarSvg}
            />

            <NavItem
                text="הדפסת דוחות"
                alt="pie chart sidebar svg"
                src={pieChartSidebarSvg}
            />

            {user.role !== "1" ? (
                <></>
            ) : (
                <>
                    {/* Divider */}
                    <hr className="sidebar-divider" />

                    {/* Heading */}
                    <NavMiniHeader text="משתמשים" />

                    <NavItem
                        url="/users-management"
                        text="ייחוס הרשאות"
                        alt="user sidebar svg"
                        src={userSidebarSvg}
                    />
                </>
            )}
        </ul>
    );
}

function NavItem(props) {
    return (
        <li className="nav-item text-right">
            <a className="nav-link text-right" href={props.url}>
                <i className="fas fa-fw fa-folder"></i>
                <span className="sidebar-link">{props.text}</span>
                <img
                    className="ml-1 image-icon-navitem"
                    alt={props.alt}
                    src={props.src}
                />
            </a>
        </li>
    );
}

function NavMiniHeader(props) {
    return (
        <div className="sidebar-heading text-right mb-1">
            <h6 className="sidebar-miniheader">{props.text}</h6>
        </div>
    );
}
