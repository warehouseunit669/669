import PageDescription from "../components/PageDescription";
import "startbootstrap-sb-admin-2/css/sb-admin-2.min.css";
import { collection, getDocs } from "firebase/firestore";
import FilesListCard from "../components/FilesListCard";
import getTable from "../help_functions/GetTable";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import AuthContext from "../AuthContext";
import { db } from "../firebase-config";
import React, {useContext} from "react";
 

export default function FilesManagment() {
    // This is the files management page.
    // Here you can view all the files existed. You can Browse inside the files and allocate items from the equipment items.
    // Each item you allocate to a file won't be available for another file.

    // Check if the user is authenticated.
    const { isAuthenticated, loading, user } = useContext(AuthContext);
    const navigate = useNavigate();
  
    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate, loading]);

    const [filesData, setFilesData] = React.useState([{}]);
    const [makatimData, setMakatimData] = React.useState([{}]);
    const pageTitle = "ניהול תיקים";
    const bodyTitle = "רשימת ניהול תיקים";
    const bodyPara =
        "בעמוד זה ניתן לברור בתיקים קיימים. כל תיק מכיל רשימת ציוד הייחודית לאותו תיק. כאשר תלחצו על תיק ספציפי תועברו לעמוד שלו, שם תוכלו לצפות/לערוך אותו.";
    const collectionName = "files";

    // Get the "files" table
    // Save it in the "filesData"
    React.useEffect(() => {
        const collectionRef = collection(db, collectionName);

        const getList = async () => {
            const data = await getDocs(collectionRef);
            setFilesData(
                data.docs.map((doc) => ({ ...doc.data(), docRef: doc.id })),
            );
        };

        getList();
    }, []);

    // Allocate the data to the makatimData useState() by the name of the collection.
    getTable(setMakatimData, "makatim");

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
                        title={pageTitle}
                    />

                    {/* Begin Page Content */}
                    <div className="container-fluid row">
                        {/* Page Heading */}
                        <div className="col-lg-1"></div>
                        <div className="col-lg-10 text-right">
                            <PageDescription
                                title={bodyTitle}
                                para={bodyPara}
                            />
                            <FilesListCard
                                filesData={filesData}
                                filesDataState={setFilesData}
                                userData={user}
                                makatimData={makatimData}
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
