import TemplateCreationModal from "./modals/TemplateCreationModal";
import SetDateExpInfo from "../help_functions/SetDateExpInfo";
import GetExpiredRows from "../help_functions/GetExpiredRows";
import DeleteRowModal from "./modals/DeleteTableRowsModal";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import SortFiles from "../help_functions/SortFiles";
import CardHeader from "../components/CardHeader";
import NewFileModal from "./modals/NewFileModal";
import CardContent from "@mui/joy/CardContent";
import ListTemplate from "./ListTemplate";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import "../css/makatim-card.css";
import Chip from "@mui/joy/Chip";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import React from "react";

export default function FilesListCard(props) {
    const collectionName = "files";
    const [userSearch, setUserSearch] = React.useState("");
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [isExpiredRows, setExpiredRows] = React.useState(true);
    const [isAlmostExpiredRows, setAlmostExpiredRows] = React.useState(true);
    const [isUnexpiredRows, setUnexpiredRows] = React.useState(true);
    const [isTotalRows, setTotalRows] = React.useState(true);

    const filesData = SetDateExpInfo(
        props.filesData.map((file) => {
            file.items = GetExpiredRows(file.items);
            return file;
        }),
    );
    const filesDataState = props.filesDataState;
    const userData = props.userData;
    const makatimData = props.makatimData;

    // Filter rowsData based on the search term
    const filteredData = filesData.filter((row) => {
        // Check if any item in the row contains the search term
        return row?.fileName?.toString().includes(userSearch);
    });

    // Handle user table search
    function handleSearch(event) {
        // Get user input live
        setUserSearch(event.target.value);
    }

    function handleSort(isOrdered, isOrderedState, itemsName) {
        filesDataState(SortFiles(filesData, itemsName, isOrdered));
        isOrderedState((prevValue) => !prevValue);
    }

    const cardName = "תיקים";
    const cardTitle = "כמות פריטים בטבלה: " + filteredData.length;

    return (
        <>
            <Box
                sx={{
                    display: { xs: "none", sm: "block" }, // Hide on extra small screens, show on small screens and above
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        direction: "rtl",
                        textAlign: "right",
                        width: "fit-content",
                        marginBottom: "10px",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: "sm",
                        bgcolor: "background.surface",
                        padding: "2px",
                        color: "text.secondary",
                        marginLeft: "auto",
                        "& svg": {
                            m: 1.5,
                        },
                        "& hr": {
                            mx: 0.5,
                        },
                    }}
                >
                    <Chip
                        variant="soft"
                        color="danger"
                        sx={{ margin: "3px", "--Chip-radius": "4px" }}
                    >
                        פג תוקף
                    </Chip>
                    <Chip
                        variant="soft"
                        color="warning"
                        sx={{ margin: "3px", "--Chip-radius": "4px" }}
                    >
                        פג בעוד 30 ימים
                    </Chip>
                    <Chip
                        variant="soft"
                        color="success"
                        sx={{ margin: "3px", "--Chip-radius": "4px" }}
                    >
                        בתוקף
                    </Chip>
                    <Divider orientation="vertical" />
                    <Chip
                        variant="soft"
                        sx={{ margin: "3px", "--Chip-radius": "4px" }}
                    >
                        סך הכל
                    </Chip>
                </Box>
            </Box>

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
                            <h1 className="mt-1 col-12 text-right">
                                {cardTitle}
                            </h1>
                        </div>
                        <div className="row mt-3 ml-1 mr-1">
                            <div className="col-lg-5 col-sm-12 order-lg-3 text-right">
                                <Input
                                    placeholder="חיפוש..."
                                    onChange={handleSearch}
                                    sx={{
                                        textAlign: "right",
                                        direction: "rtl",
                                    }}
                                />
                            </div>
                            <div className="col-lg-5 order-lg-2"></div>
                            <br className="visible-xs" />
                            <div className="col-lg-2 col-sm-12 order-lg-1">
                                <div className="row">
                                    {userData?.role === "1" && (
                                        <>
                                            <div className="col-sm-4 mb-2">
                                                <DeleteRowModal
                                                    selectedRows={selectedRows}
                                                    selectedRowsState={
                                                        setSelectedRows
                                                    }
                                                    tableData={filesData}
                                                    tableState={filesDataState}
                                                    collectionName={
                                                        collectionName
                                                    }
                                                    currentPageName="files"
                                                />
                                            </div>
                                            <div className="col-sm-4 mb-2">
                                                <NewFileModal
                                                    filesData={filesData}
                                                    filesDataState={
                                                        filesDataState
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* INSERT INTO userData?.role === "1" up up up up */}
                                    {/* <div className="col-sm-4 mb-2">
                                        <TemplateCreationModal
                                            makatimData={makatimData}
                                        />
                                    </div> */}
                                    {/* INSERT INTO userData?.role === "1" up up up up */}

                                    {userData?.role === "2" && (
                                        <>
                                            <div className="col-sm-12 col-lg-6 mb-2">
                                                <NewFileModal
                                                    filesData={filesData}
                                                    filesDataState={
                                                        filesDataState
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3 ml-1 mr-1">
                            <div className="col-12 text-right">
                                <Button
                                    variant="soft"
                                    className="ml-3 mb-2"
                                    onClick={(e) =>
                                        handleSort(
                                            isTotalRows,
                                            setTotalRows,
                                            "Total Rows",
                                        )
                                    }
                                >
                                    סך הכל
                                    <SwapVertIcon />
                                </Button>
                                <Button
                                    variant="soft"
                                    className="ml-3 mb-2"
                                    onClick={(e) =>
                                        handleSort(
                                            isUnexpiredRows,
                                            setUnexpiredRows,
                                            "Unexpired Rows",
                                        )
                                    }
                                >
                                    בתוקף
                                    <SwapVertIcon />
                                </Button>
                                <Button
                                    variant="soft"
                                    className="ml-3 mb-2"
                                    onClick={(e) =>
                                        handleSort(
                                            isAlmostExpiredRows,
                                            setAlmostExpiredRows,
                                            "Almost Expired Rows",
                                        )
                                    }
                                >
                                    פגים בעוד 30 ימים
                                    <SwapVertIcon />
                                </Button>
                                <Button
                                    variant="soft"
                                    className="ml-3 mb-2"
                                    onClick={(e) =>
                                        handleSort(
                                            isExpiredRows,
                                            setExpiredRows,
                                            "Expired Rows",
                                        )
                                    }
                                >
                                    פגי תוקף
                                    <SwapVertIcon />
                                </Button>
                            </div>
                        </div>
                        <div className="row mt-3 ml-1 mr-1 mb-1">
                            <div className="col-12">
                                <ListTemplate
                                    setSelectedRowsState={setSelectedRows}
                                    selectedRows={selectedRows}
                                    filesData={filteredData}
                                    filesDataState={filesDataState}
                                    userData={userData}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
