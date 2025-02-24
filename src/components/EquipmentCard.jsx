import UpdateEquipmentModal from "./modals/UpdateEquipmentModal";
import DownloadExcel from "../help_functions/DownloadExcelTable";
import GetExpiredRows from "../help_functions/GetExpiredRows";
import SortRowsByDate from "../help_functions/SortRowsByDate";
import DeleteRowModal from "./modals/DeleteTableRowsModal";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import TableTemplate from "../components/TableTemplate";
import AddRowModal from "./modals/AddRowEquipmentModal";
import Download from "@mui/icons-material/Download";
import CardHeader from "../components/CardHeader";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Card from "@mui/joy/Card";
import "../css/makatim-card.css";
import React from "react";

export default function EquipmentCard(props) {
    // This component is responsible for displaying the equipment card on the page.
    // This component is "specific" as it is only used for the equipment page.

    let tableData = GetExpiredRows(props.tableData);
    const userData = props.userData;
    const tableState = props.setTableState;
    const tableHeaders = [
        "תיק משובץ",
        "תאריך תפוגה",
        "אצווה/סדרה",
        'מק"ט',
        "שם פריט",
    ];
    const [userSearch, setUserSearch] = React.useState("");
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [isDateSorted, setIsDateSorted] = React.useState(true);
    const [isCreationDateSorted, setCreationDateSorted] = React.useState(true);

    // Filter rowsData based on the search term
    const filteredData = tableData.filter((row) => {
        // Check if any item in the row contains the search term
        return row?.items?.some((item) =>
            item?.toString().includes(userSearch),
        );
    });

    const cardName = "פריטים";
    const cardTitle = "כמות פריטים בטבלה: " + filteredData.length;

    // Handle user table search
    function handleSearch(event) {
        // Get user input live
        setUserSearch(event.target.value);
    }

    function handleExcelDownload() {
        const fileName = "טבלת-ניהול-ציוד";
        DownloadExcel(tableHeaders, tableData, fileName);
    }

    function handleSort(isSorted, setIsSorted, desiredSort) {
        tableState(SortRowsByDate(tableData, isSorted, desiredSort));
        setIsSorted((prevState) => !prevState);
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
                        <div className="col-lg-4 order-lg-2"></div>
                        <br className="visible-xs" />
                        <div className="col-lg-3 col-sm-12 order-lg-1">
                            <div className="row">
                                {userData?.role === "1" && 
                                    (
                                        <>
                                        <div className="col-sm-3 mb-2">
                                            <Button
                                                className="w-100"
                                                color="primary"
                                                onClick={handleExcelDownload}
                                            >
                                                <Download />
                                            </Button>
                                        </div>
                                        <div className="col-sm-3 mb-2">
                                            <DeleteRowModal
                                                selectedRows={selectedRows}
                                                selectedRowsState={setSelectedRows}
                                                tableData={tableData}
                                                tableState={tableState}
                                                collectionName="equipment"
                                                currentPageName="equipment"
                                            />
                                        </div>
                                        <div className="col-sm-3 mb-2">
                                            <AddRowModal
                                                tableData={tableData}
                                                tableState={tableState}
                                            />
                                        </div>
                                        <div className="col-sm-3 mb-2">
                                            <UpdateEquipmentModal
                                                tableData={tableData}
                                                tableState={tableState}
                                                selectedRow={selectedRows}
                                            />
                                        </div>
                                        </>
                                        )
                                }
                                {userData?.role === "2" && (
                                    <>
                                        <>
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
                                            <AddRowModal
                                                tableData={tableData}
                                                tableState={tableState}
                                            />
                                        </div>
                                        <div className="col-sm-4 mb-2">
                                            <UpdateEquipmentModal
                                                tableData={tableData}
                                                tableState={tableState}
                                                selectedRow={selectedRows}
                                            />
                                        </div>
                                        </>
                                    </>
                                )}
                                {userData?.role === "3" && 
                                    (
                                        <div className="col-sm-12 col-lg-3 mb-2">
                                            <Button
                                                className="w-100"
                                                color="primary"
                                                onClick={handleExcelDownload}
                                            >
                                                <Download />
                                            </Button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2 ml-1 mr-1">
                        <div className="col-12 text-right">
                            <Button
                                variant={"soft"}
                                onClick={() => handleSort(isDateSorted, setIsDateSorted, "Expiration Date")}
                            >
                                תאריך תפוגה
                                <SwapVertIcon />
                            </Button>
                            <Button
                                className="ml-3 mb-2 mt-2"
                                variant={"soft"}
                                onClick={() => handleSort(isCreationDateSorted, setCreationDateSorted, "Creation Date")}
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
                                rowsData={filteredData}
                                setSelectedRowsState={setSelectedRows}
                                selectedRows={selectedRows}
                                currentPage="equipment"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
