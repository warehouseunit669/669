import PageDescription from "../components/PageDescription";
import "startbootstrap-sb-admin-2/css/sb-admin-2.min.css";
import MissionsCard from "../components/MissionsCard";
import getTable from "../help_functions/GetTable";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import React from "react";

import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import {useContext} from "react";

export default function MissionsManagement() {
    // This component renders the missions page.
    // You can view all your missions here and create micromissions.
    // params: None.

    // Check if the user is authenticated.
    const { isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();
  
    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate, loading]);

    const pageTitle = "מעקב משימות";
    const bodyTitle = "טבלת מעקב משימות";
    const bodyPara =
        "בעמוד זה ניתן לעקוב אחר משימות יומיות / שבועיות ולשבץ משימות לצוות מוגדר מראש. בכל תאריך מוגדר, המשימות היומיות/שבועיות ימחקו לצמיתות.";
    const collectionName = "missions";

    const [missionsData, setMissionsData] = React.useState([]);
    console.log(missionsData);

    // Get the missions data
    getTable(setMissionsData, collectionName);

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
                            <PageDescription
                                title={bodyTitle}
                                para={bodyPara}
                            />
                            <MissionsCard
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
