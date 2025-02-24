import PageDescription from "../components/PageDescription";
import "startbootstrap-sb-admin-2/css/sb-admin-2.min.css";
import MakatimCard from "../components/MakatimCard";
import getTable from "../help_functions/GetTable";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import AuthContext from "../AuthContext";
import React, {useContext} from "react";

export default function Makatim() {
    // This is the makatim component - responsible for the control of core items in the website.
    // Core items are items which you can find in the basement.
    // Core items are the name of the medicines, you can't have 2 medicines with the same name, they are rare.
    // Everytime someone will add a medicine to the Makatim page will be like someone is creating another type of variable like int, string or boolean
    // that can't be created twice.
    // params: None.

    // makatimData is an array of objects with the data contains the rows of the table.
    // Remember that the length of the "items" key in makatim data must be 2.
    // Example for makatimData:
    // [
    //     {items: ['כאן המק"ט', 'שם הפריט'], id: 'lsa48ecb', docRef: '6ckofVM83oujrcBCvCjy'},
    //     {items: ['זנב', 'ראש'], id: 'lsa4cdxg', docRef: '7eke9GC6NTAPahAbQMRs'},
    // ]
    // Type: Array[Object{key: Array[string, string], key: string, key: string}]

    // Check if the user is authenticated.
    const { isAuthenticated, loading, user } = useContext(AuthContext);
    const navigate = useNavigate();
  
    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate, loading]);

    const [makatimData, setMakatimData] = React.useState([{}]);
    const pageTitle = 'ניהול חומרים ומק"טים';
    const bodyTitle = 'טבלת חומרים ומק"טים';
    const bodyPara =
        'טבלה זו נועדה כדי לשמור את כל החומרים הקיימים המקושרים למספר קטלוגי מסוים. למספרים הקטלוגים האלו יהיה אפשר לגשת בטבלת ניהול ציוד כאשר יוצרים שורה חדשה בטבלה. לא ניתן ליצור עוד פריט עם שם או מק"ט שכבר מופיע בטבלה.';
    const collectionName = "makatim";

    // Allocate the data to the makatimData useState() by the name of the collection.
    getTable(setMakatimData, collectionName);

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

                        <div className="col-lg-10">
                            <PageDescription
                                title={bodyTitle}
                                para={bodyPara}
                            />
                            <MakatimCard
                                makatimData={makatimData}
                                makatimDataState={setMakatimData}
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
