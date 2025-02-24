import "startbootstrap-sb-admin-2/css/sb-admin-2.min.css";
import errorSvg from "../assets/404-Error.svg";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import AuthContext from "../AuthContext";
import React, {useContext} from "react";

export default function NotFound() {
    // Check if the user is authenticated.
    const pageTitle = "הדף לא נמצא";
    const bodyTitle = "הדף הרצוי לא נמצא כאן...";
    const { isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();
  
    React.useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate, loading]);

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
                        <div className="col-lg-10 text-center">
                            <img src={errorSvg} alt="Error 404 SVG" className="img-fluid" width={700} />
                            <h1 className="h2 text-gray-900 mb-4">{bodyTitle}</h1>
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
