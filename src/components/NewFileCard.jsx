import DownloadExcel from "../help_functions/DownloadExcelTable";
import GetExpiredRows from "../help_functions/GetExpiredRows";
import SortRowsByDate from "../help_functions/SortRowsByDate";
import DeleteRowModal from "./modals/DeleteTableRowsModal";
import TableTemplate from "../components/TableTemplate";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import AddRowFileModal from "./modals/AddRowFileModal";
import Download from "@mui/icons-material/Download";
import CardHeader from "../components/CardHeader";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Card from "@mui/joy/Card";
import "../css/makatim-card.css";
import React from "react";

export default function NewFileCard(props) {
    // This component is responsible for the new file card rendering in the NewFile page.
    // params: props.filesData        -> Object{key: string, key: string, key: string, Array[Object{key: Array[string], key: string, key: string, key: string}]},
    //         props.setFilesData     -> useState(),
    //         props.equipmentData    -> Array[Object{key: Array[string], key: string, key: string, key: string}].
    //         props.equipmentState   -> useState(),
    //         props.fileName         -> str,

    const filesData = GetExpiredRows(props.filesData);
    const setFilesData = props.setFilesData;
    const equipmentData = props.equipmentData;
    const equipmentState = props.equipmentState;
    const fileName = props.fileName;

    const cardName = "תיק קיים";
    const cardTitle = "כמות פריטים בטבלה: " + filesData.length;
    const tableHeaders = ["תאריך תפוגה", "אצווה/סדרה", 'מק"ט', "שם פריט"];

    const [userSearch, setUserSearch] = React.useState("");
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [isDateSorted, setIsDateSorted] = React.useState(true);
    const [isCreationDateSorted, setCreationDateSorted] = React.useState(true);

    // Filter rowsData based on the search term
    const filteredData = filesData.filter((row) => {
        // Check if any item in the row contains the search term
        return row?.items?.some((item) => item.toString().includes(userSearch));
    });

    // Handle user table search
    function handleSearch(event) {
        // Get user input live
        setUserSearch(event.target.value);
    }

    function handleSort(isOrdered, isOrderedState, desiredSort) {
        setFilesData((prevData) => ({
            ...prevData,
            items: SortRowsByDate(filesData, isOrdered, desiredSort),
        }));
        isOrderedState((prevState) => !prevState);
    }

    function handleExcelDownload() {
        const excelFileName = "תיק - " + fileName;
        DownloadExcel(tableHeaders, filesData, excelFileName);
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
                                    <DeleteRowModal
                                        selectedRows={selectedRows}
                                        selectedRowsState={setSelectedRows}
                                        tableData={filesData}
                                        tableState={setFilesData}
                                        collectionName="files"
                                        currentPageName="file"
                                        fileName={fileName}
                                        equipmentData={equipmentData}
                                        equipmentState={equipmentState}
                                    />
                                </div>
                                <div className="col-sm-4 mb-2">
                                    <AddRowFileModal
                                        tableData={filesData}
                                        tableState={setFilesData}
                                        fileName={fileName}
                                        equipmentData={equipmentData}
                                        equipmentState={equipmentState}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2 ml-1 mr-1">
                        <div className="col-12 text-right">
                            <Button
                                variant="soft"
                                onClick={() =>
                                    handleSort(
                                        isDateSorted,
                                        setIsDateSorted,
                                        "Expiration Date",
                                    )
                                }
                            >
                                תאריך תפוגה
                                <SwapVertIcon />
                            </Button>
                            <Button
                                className="ml-3 mb-2"
                                variant="soft"
                                onClick={() =>
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
                                rowsData={filteredData}
                                setSelectedRowsState={setSelectedRows}
                                selectedRows={selectedRows}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
