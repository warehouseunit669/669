import PageDescription from "../components/PageDescription";
import "startbootstrap-sb-admin-2/css/sb-admin-2.min.css";
import SingleMissionCard from "../components/SingleMissionCard";
import getTable from "../help_functions/GetTable";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import AuthContext from "../AuthContext";
import React, { useContext } from "react";

export default function MissionPage() {
    // This is the mission page.
    // Here you can view all the missions existed. You can Browse inside the missions and allocate items from the equipment items.
    // Each item you allocate to a mission won't be available for another mission.

    // Check if the user is authenticated.
    const { isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate, loading]);

    // Retrieve the file name from the url
    const location = useLocation();
    const pathName = location.pathname.split("/");
    const missionName = decodeURI(pathName[pathName.length - 1]);

    const pageTitle = "מעקב משימות";
    const bodyTitle = "משימה: " + missionName;
    const bodyPara = "";
    const collectionName = "";

    const [missionsData, setMissionsData] = React.useState([]);

    // Get the missions data
    // getTable(setMissionsData, collectionName);

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
                    <TopBar image_url="user-image.png" title={pageTitle} />

                    {/* Begin Page Content */}
                    <div className="container-fluid row">
                        {/* Page Heading */}
                        <div className="col-lg-1"></div>

                        <div className="col-lg-10">
                            <PageDescription
                                title={bodyTitle}
                                para={bodyPara}
                            />
                            <SingleMissionCard
                                missionsData={missionsData}
                                missionsDataState={setMissionsData}
                            />
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
