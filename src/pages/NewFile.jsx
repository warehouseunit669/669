import PageDescription from "../components/PageDescription";
import "startbootstrap-sb-admin-2/css/sb-admin-2.min.css";
import GetFileTable from "../help_functions/GetFileTable";
import NewFileCard from "../components/NewFileCard";
import getTable from "../help_functions/GetTable";
import { useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import React from "react";

import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import {useContext} from "react";

export default function NewFile() {
    // This is the new file page.
    // Here you can view all the files existed. You can Browse inside the files and allocate items from the equipment items.
    // Each item you allocate to a file won't be available for another file.
    // params: None.

    // Check if the user is authenticated.
    const { isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();
  
    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate, loading]);

    // Retrieve the file name from the url
    const location = useLocation();
    const pathName = location.pathname.split("/");
    const fileName = decodeURI(pathName[pathName.length - 1]);

    const [filesData, setFilesData] = React.useState([
        { id: "", idMakatim: "", items: ["", "", "", ""] },
    ]);
    const [equipmentData, setEquipmentData] = React.useState([
        { items: [{ id: "", idMakatim: "", items: ["", "", "", ""] }] },
    ]);
    const pageTitle = "ניהול תיקים";
    const bodyTitle = "שם תיק: " + fileName;

    // Get the "files" table.
    // Save the table as array of objects in "filesData" variable.
    React.useEffect(() => {
        GetFileTable(fileName, setFilesData);
    }, []);

    // Get the equipment table so the user will search for items to add to the table.
    getTable(setEquipmentData, "equipment");

    return (
        <div id="wrapper" className="d-flex">
            {" "}
            {/* Use d-flex for flexbox layout */}
            {/* Content Wrapper */}
            <div
                id="content-wrapper"
                className="flex-grow-1 d-flex flex-column"
            >
                {" "}
                {/* Flex-grow-1 to take up remaining space */}
                {/* Main Content */}
                <div id="content">
                    {/* Topbar */}
                    <TopBar
                        image_url="user-image.png"
                        username="נאור אור ציון"
                        title={pageTitle}
                    />

                    {/* Begin Page Content */}
                    <div className="container-fluid row">
                        {/* Page Heading */}
                        <div className="col-lg-1"></div>

                        <div className="col-lg-10">
                            <PageDescription title={bodyTitle} />
                            {filesData !== "" ? (
                                <NewFileCard
                                    filesData={
                                        Array.isArray(filesData)
                                            ? filesData
                                            : filesData.items
                                    }
                                    fileName={fileName}
                                    setFilesData={setFilesData}
                                    equipmentData={equipmentData}
                                    equipmentState={setEquipmentData}
                                />
                            ) : (
                                ""
                            )}
                        </div>
                        <div className="col-lg-1"></div>
                    </div>
                </div>
            </div>
            {/* Sidebar */}
            <SideBar />
        </div>
    );
}
