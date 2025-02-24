import SwapVertIcon from "@mui/icons-material/SwapVert";
import NewMissionModal from "./modals/NewMissionModal";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import CardHeader from "./CardHeader";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Card from "@mui/joy/Card";
import "../css/makatim-card.css";
import React from "react";

export default function SingleMissionCard({ missionsData, missionsDataState }) {
    // This component renders the card on the missions page.
    // params: missionsData      -> Array[Object{key: value, Array[Object{key: value}]}]
    //         missionsDataState -> useState()

    // Count completed micro missions in a mission
    let countDoneMicroMissions = 0;
    const insertCompletedMicroMissions = () =>
        missionsData.map((mission) => {
            mission.microMissions.map((microMission) =>
                microMission.isDone
                    ? (countDoneMicroMissions += 1)
                    : (countDoneMicroMissions += 0),
            );
            mission["completedMicroMissions"] = countDoneMicroMissions;
        });

    insertCompletedMicroMissions();

    const [selectedMissions, setSelectedMissions] = React.useState([]);
    const [userSearch, setUserSearch] = React.useState("");
    const collectionName = "missions";

    // // Filter rowsData based on the search term
    // const filteredData = filesData.filter((row) => {
    //     // Check if any item in the row contains the search term
    //     return row?.fileName?.toString().includes(userSearch);
    // });

    // Handle user search
    function handleSearch(event) {
        setUserSearch(event.target.value);
    }

    function handleSort(isOrdered, isOrderedState, itemsName) {
        return;
    }

    const cardName = "משימות";
    const cardTitleFirst = "פרטי משימה";
    const cardTitleSecond = "כמות משימות: " + missionsData.length;

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
                sx={{ alignItems: "center", gap: 1, direction:"rtl"}}
            >
                <div className="col-lg-12">
                    <div className="row mt-3 ml-1 mr-1">
                        <h1 className="mt-1 col-12 text-right">
                            {cardTitleFirst}
                        </h1>
                    </div>
                        <Input
                            placeholder="שם משימה"
                        />
                        <Input
                            placeholder="שייכות"
                        />
                        <Input
                            placeholder="תאריך יעד"
                        />
                        <Input
                            placeholder="תיק משובץ למשימה"
                        />

                    <div className="row mt-3 ml-1 mr-1">
                        <h1 className="mt-1 col-12 text-right">
                            {cardTitleSecond}
                        </h1>
                    </div>
                    <div className="row mt-3 ml-1 mr-1">
                        <div className="col-lg-5 col-sm-12 order-lg-3 text-right">
                            {/* <Input
                                placeholder="חיפוש..."
                                onChange={handleSearch}
                                sx={{ textAlign: "right", direction: "ltr" }}
                            /> */}
                        </div>
                        <div className="col-lg-5 order-lg-2"></div>
                        <br className="visible-xs" />
                        <div className="col-lg-2 col-sm-12 order-lg-1">
                            <div className="row">
                                <div className="col-sm-6 mb-2">
                                    {/* <DeleteRowModal 
                                        selectedRows={selectedRows}
                                        selectedRowsState={setSelectedRows}
                                        tableData={filesData} 
                                        tableState={filesDataState} 
                                        collectionName={collectionName} 
                                        currentPageName="files"
                                    /> */}
                                </div>
                                <div className="col-sm-6 mb-2">
                                    {/* <NewMissionModal /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3 ml-1 mr-1 mb-1">
                        <div className="col-12">{/* Missions */}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
