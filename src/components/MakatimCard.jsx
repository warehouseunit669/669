import DownloadExcel from "../help_functions/DownloadExcelTable";
import UpdateMakatimModal from "./modals/UpdateMakatimModal";
import UploadExcelMakatim from "./modals/UploadExcelMakatim";
import DeleteRowModal from "./modals/DeleteTableRowsModal";
import TableTemplate from "../components/TableTemplate";
import AddRowModal from "./modals/AddRowMakatimModal";
import Download from "@mui/icons-material/Download";
import CardHeader from "../components/CardHeader";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Card from "@mui/joy/Card";
import "../css/makatim-card.css";
import React from "react";

export default function MakatimCard({ makatimData, makatimDataState, userData }) {
    // The makatim card component is responsible for displaying a table and all it's additional items like
    // add/delete/downloadExcel buttons as well as a search bar.
    // params: makatimData      -> Array[Object{key: Array[string, string], key: string, key: string}]
    //         makatimDataState -> useState([{}]).

    const collectionName = "makatim";
    const tableHeaders = ['מק"ט', "שם פריט"];
    const [userSearch, setuserSearch] = React.useState("");
    const [selectedRows, setSelectedRows] = React.useState([]);

    // Filter rowsData based on the search term
    const filteredData = makatimData.filter((row) => {
        // Check if any item in the row contains the search term
        return row?.items?.some((item) => item.toString().includes(userSearch));
    });

    const cardName = 'חומרים ומק"טים';
    const cardTitle = "כמות פריטים בטבלה: " + filteredData.length;

    // Handle user table search
    function handleSearch(event) {
        // Get user input live
        setuserSearch(event.target.value);
    }

    function handleExcelDownload() {
        // Handke Download Excel button.
        const fileName = "טבלת-חומרים-ומקטים";
        DownloadExcel(tableHeaders, makatimData, fileName);
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
                        <div className="col-lg-3 order-lg-2"></div>
                        <br className="visible-xs" />
                        <div className="col-lg-4 col-sm-12 order-lg-1">
                            <div className="row">
                                {userData?.role === "1" ? 
                                <>
                                    <div className="col-sm-2 mb-2">
                                        <Button
                                            className="w-100"
                                            color="primary"
                                            onClick={handleExcelDownload}
                                        >
                                            <Download />
                                        </Button>
                                    </div>
                                    <div className="col-sm-2 mb-2">
                                        <DeleteRowModal
                                            selectedRows={selectedRows}
                                            selectedRowsState={setSelectedRows}
                                            tableData={makatimData}
                                            tableState={makatimDataState}
                                            collectionName={collectionName}
                                            currentPageName="makatim"
                                        />
                                    </div>
                                    <div className="col-sm-2 mb-2">
                                        <AddRowModal
                                            tableData={makatimData}
                                            tableState={makatimDataState}
                                        />
                                    </div>
                                    <div className="col-sm-2 mb-2">
                                        <UpdateMakatimModal
                                            tableData={makatimData}
                                            tableState={makatimDataState}
                                            selectedRow={selectedRows}
                                        />
                                    </div>
                                    <div className="col-sm-2 mb-2">
                                        <UploadExcelMakatim
                                            tableData={makatimData}
                                            tableState={makatimDataState}
                                        />
                                    </div>
                                </>
                                
                                : 
                                <>
                                    <div className="col-sm-12 col-lg-3 mb-2">
                                        <Button
                                            className="w-100"
                                            color="primary"
                                            onClick={handleExcelDownload}
                                        >
                                            <Download />
                                        </Button>
                                    </div>
                                </>}
                                
                            </div>
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
