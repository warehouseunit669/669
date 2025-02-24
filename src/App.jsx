import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EquipmentManagement from "./pages/EquipmentManagement";
import MissionsManagement from "./pages/MissionsManagement";
import UsersManagement from "./pages/UsersManagement";
import FilesManagment from "./pages/FilesManagment";
import MissionPage from "./pages/MissionPage";
import NotFound from "./pages/NotFound";
import AuthProvider from "./AuthProvider";
import NewFile from "./pages/NewFile";
import Makatim from "./pages/Makatim";
import Login from "./pages/Login";
import React from "react";

// The App component is responsible for the navigation control flow.
// params: None.
export default function App() {
    // The App component is responsible for the navigation control flow.
    // params: None.
    // returns: None.

    return (
        <div className="App">
            <AuthProvider>
                <Router basename="/">
                    <Routes>
                        <Route
                            path="/login"
                            element={<Login />}
                        />
                        <Route path="/makatim" element={<Makatim />} />
                        <Route
                            path="/equipment"
                            element={<EquipmentManagement />}
                        />
                        <Route path="/files" element={<FilesManagment />} />
                        <Route path="/files/:id" element={<NewFile />} />
                        {/* <Route path="/missions" element={<MissionsManagement />} />
                        <Route path="/missions/:id" element={<MissionPage />} /> */}
                        <Route
                            path="/users-management"
                            element={<UsersManagement />}
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </div>
    );
}
