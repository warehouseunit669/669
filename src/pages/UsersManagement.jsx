import UsersManagementCard from "../components/UsersMangementCard";
import PageDescription from "../components/PageDescription";
import "startbootstrap-sb-admin-2/css/sb-admin-2.min.css";
import getTable from "../help_functions/GetTable";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import React from "react";

import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import {useContext} from "react";

export default function UsersManagement() {
    // This component renders the users management page.
    // The page will contain a table which responsible for the user's level.
    // Users can vary with privileges that goes from level 3 down to 1.
    // Level 1 is admin like - He can add/delete users.
    // Level 2 can edit tables and level 3 can only view tables.
    // params: None.

    // Check if the user is authenticated.
    const { isAuthenticated, loading, user } = useContext(AuthContext);
    const [usersData, setUsersData] = React.useState([]);
    const navigate = useNavigate();
    
    const pageTitle = "ייחוס הרשאות";
    const bodyTitle = "עמוד ייחוס הרשאות";
    const bodyPara =
        "בעמוד זה ניתן ליצור/למחוק/לערוך משתמשים, בנוסף ניתן לייחס הרשאות למשתמשים קיימים. בעץ ההרשאות יש את הדרג הראשון - מנהלן (יכול לגשת להכול ולערוך משתמשים), דרג שני - צוות רפואי (הוספה של תיקים ומשימות), דרג שלישי - לוחמים ומטפלים (קריאה וכתיבה של טבלאות בלבד). כאשר נוצר משתמש חדש הוא אוטומטית משתייך לדרג השלישי, מנהלן יכול לשנות את הדרג שלו לאחר מכן. ";
    const collectionName = "users";

    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        } else if (!loading && user.role !== "1") {
            navigate('/not-found');
        }
    }, [isAuthenticated, navigate, loading, ]);

    // Get the missions data
    getTable(setUsersData, collectionName);

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
                            <UsersManagementCard
                                usersData={usersData}
                                usersDataState={setUsersData}
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
