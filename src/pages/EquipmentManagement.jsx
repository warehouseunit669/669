import PageDescription from "../components/PageDescription";
import "startbootstrap-sb-admin-2/css/sb-admin-2.min.css";
import EquipmentCard from "../components/EquipmentCard";
import getTable from "../help_functions/GetTable";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import AuthContext from "../AuthContext";
import React, {useContext} from "react";

export default function EquipmentManagment() {
    // equipmentData is an array of objects with the data contains the rows of the table.
    // Example for equipmentData:
    // [
    //     {items: ['תאריך תפוגה', 'אצווה/סדרה', 'מק"ט', 'שם פריט'], id: 'lsa48ecb', docRef: '6ckofVM83oujrcBCvCjy'},
    //     {items: ['זנב', 'ראש'], id: 'lsa4cdxg', docRef: '7eke9GC6NTAPahAbQMRs'},
    // ]

    // Check if the user is authenticated.
    const { isAuthenticated, loading, user } = useContext(AuthContext);
    const navigate = useNavigate();
  
    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate, loading]);

    const [equipmentData, setEquipmentData] = React.useState([]);
    const pageTitle = "ניהול ציוד";
    const bodyTitle = "טבלת ניהול ציוד";
    const bodyPara =
        "טבלה זו נועדה לניהול הציוד הקיים במחסן. כל ציוד שיתווסף בטבלה זו יהיה נגיש בניהול תיקים, מעקב תיקים, תיק ייחודי והדפסת דוחות. שורה בטבלה תסומן בצהוב כאשר תאריך התפוגה של הפריט קרוב לטווח של 30 יום. שורה בטבלה תסומן באדום כאשר פג תוקפו של הפריט.";
    const collectionName = "equipment";

    // Get the "equipment" table.
    // Save the table as array of objects in "equipmentData" variable.
    getTable(setEquipmentData, collectionName);

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
                            <EquipmentCard
                                tableData={equipmentData}
                                setTableState={setEquipmentData}
                                userData={user}
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
