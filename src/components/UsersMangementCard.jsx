import DownloadExcel from "../help_functions/DownloadExcelTable";
import DeleteUsersModal from "./modals/DeleteUsersModal";
import TableTemplate from "../components/TableTemplate";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SortUsers from "../help_functions/SortUsers";
import Download from "@mui/icons-material/Download";
import AddRowModal from "./modals/AddRowUserModal";
import CardHeader from "../components/CardHeader";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Card from "@mui/joy/Card";
import "../css/makatim-card.css";
import React from "react";

export default function UsersManagementCard({ usersData, usersDataState }) {
    // The makatim card component is responsible for displaying a table and all it's additional items like
    // add/delete/downloadExcel buttons as well as a search bar.
    // params: usersData      -> Array[Object{key: string, key: string, key: string, key: string}]
    //         usersDataState -> useState([]).

    const collectionName = "users";
    const currentPageName = "users-management";
    const tableHeaders = ["רמת הרשאות", "אימייל", "טלפון", "שם מלא"];
    const [userSearch, setuserSearch] = React.useState("");
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [isLevelOneSorted, setLevelOneSorted] = React.useState(true);
    const [isLevelTwoSorted, setLevelTwoSorted] = React.useState(true);
    const [isLevelThreeSorted, setLevelThreeSorted] = React.useState(true);
    const [isCreationDateSorted, setCreationDateSorted] = React.useState(true);

    // Filter usersData based on the search term
    const filteredUsersData = usersData.filter((row) => {
        // Check if any item in the row contains the search term
        return row?.items?.some((item) => item.toString().includes(userSearch));
    });

    const cardName = "רשימת משתמשים";
    const cardTitle = "כמות פריטים בטבלה: " + filteredUsersData.length;

    // Handle user table search
    function handleSearch(event) {
        // Get user input live
        setuserSearch(event.target.value);
    }

    function handleSort(isOrdered, isOrderedState, desiredSort) {
        // Handle sort button.
        usersDataState(SortUsers(usersData, desiredSort, isOrdered));
        isOrderedState((prevValue) => !prevValue);
    }

    function handleExcelDownload() {
        // Handke Download Excel button.
        const fileName = "טבלת-משתמשים";
        DownloadExcel(tableHeaders, usersData, fileName);
    }

    return (
        <Card
            className="mb-5"
            variant="outlined"
            sx={{ boxShadow: "0px 4px 15px 1px rgba(0,0,0,0.15)" }}
        >
            <CardHeader title={cardName} />
            <Divider />
            <CardContent
                className="row"
                orientation="horizontal"
                sx={{ alignItems: "center", gap: 1 }}
            >
                <div className="col-lg-12">
                    <div className="row mt-3 ml-1 mr-1">
                        <h1 className="mt-1 col-12 text-right">{cardTitle}</h1>
                    </div>
                    <div className="row mt-3 ml-1 mr-1">
                        <div className="col-lg-5 col-sm-12 order-lg-3 text-right">
                            <Input
                                placeholder="חיפוש..."
                                onChange={handleSearch}
                                sx={{ textAlign: "right", direction: "rtl" }}
                            />
                        </div>
                        <div className="col-lg-5 order-lg-2"></div>
                        <br className="visible-xs" />
                        <div className="col-lg-2 col-sm-12 order-lg-1">
                            <div className="row">
                                <div className="col-sm-4 mb-2">
                                    <Button
                                        className="w-100"
                                        color="primary"
                                        onClick={handleExcelDownload}
                                    >
                                        <Download />
                                    </Button>
                                </div>
                                <div className="col-sm-4 mb-2">
                                    <DeleteUsersModal
                                        selectedRows={selectedRows}
                                        selectedRowsState={setSelectedRows}
                                        tableData={usersData}
                                        tableState={usersDataState}
                                        collectionName={collectionName}
                                    />
                                </div>
                                <div className="col-sm-4 mb-2">
                                    <AddRowModal
                                        tableData={usersData}
                                        tableState={usersDataState}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-2 ml-1 mr-1">
                        <div className="col-12 text-right">
                            <Button
                                variant="soft"
                                className="ml-3 mb-2"
                                onClick={(e) =>
                                    handleSort(
                                        isLevelThreeSorted,
                                        setLevelThreeSorted,
                                        "3",
                                    )
                                }
                            >
                                רמה 3
                                <SwapVertIcon />
                            </Button>
                            <Button
                                variant="soft"
                                className="ml-3 mb-2"
                                onClick={(e) =>
                                    handleSort(
                                        isLevelTwoSorted,
                                        setLevelTwoSorted,
                                        "2",
                                    )
                                }
                            >
                                רמה 2
                                <SwapVertIcon />
                            </Button>
                            <Button
                                variant="soft"
                                className="ml-3 mb-2"
                                onClick={(e) =>
                                    handleSort(
                                        isLevelOneSorted,
                                        setLevelOneSorted,
                                        "1",
                                    )
                                }
                            >
                                רמה 1
                                <SwapVertIcon />
                            </Button>
                            <Button
                                variant="soft"
                                className="ml-3 mb-2"
                                onClick={(e) =>
                                    handleSort(
                                        isCreationDateSorted,
                                        setCreationDateSorted,
                                        "Creation Date",
                                    )
                                }
                            >
                                תאריך יצירה
                                <SwapVertIcon />
                            </Button>
                        </div>
                    </div>

                    <div className="row mt-3 ml-1 mr-1 mb-1">
                        <div className="col-12">
                            <TableTemplate
                                colHeaders={tableHeaders}
                                rowsData={filteredUsersData}
                                setSelectedRowsState={setSelectedRows}
                                selectedRows={selectedRows}
                                currentPage={currentPageName}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
