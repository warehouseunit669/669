import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MissionsInfoModal from "./modals/MissionInfoModal";
import ClearIcon from "@mui/icons-material/Clear";
import CardOverflow from "@mui/joy/CardOverflow";
import DoneIcon from "@mui/icons-material/Done";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Checkbox from "@mui/joy/Checkbox";
import { Button } from "@mui/joy";
import Card from "@mui/joy/Card";
import Chip from "@mui/joy/Chip";
import Box from "@mui/joy/Box";
import React from "react";

export default function MissionsListTemplate({
    missionsData,
    selectedMissions,
    setSelectedMissions,
}) {
    // This function maps over the missionsData array and populates the mission's list.
    // params: missionsData        -> Array[Object{key: value, Array[Object{key: value}]}]
    //         selectedMissions    -> Array[]
    //         setSelectedMissions -> useState()
    //
    // returns: None.

    const handleClick = (event, id) => {
        // Handle checkbox click function
        const selectedIndex = selectedMissions.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedMissions, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedMissions.slice(1));
        } else if (selectedIndex === selectedMissions.length - 1) {
            newSelected = newSelected.concat(selectedMissions.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedMissions.slice(0, selectedIndex),
                selectedMissions.slice(selectedIndex + 1),
            );
        }

        setSelectedMissions(newSelected);
    };

    const missions = missionsData.map((row) => {
        return (
            <Card
                className="mb-3"
                orientation="horizontal"
                variant="outlined"
                sx={{
                    width: "100%",
                    background: "#F9F9F9",
                    textAlign: "right",
                    overflowX: "auto",
                    // display: "flex",
                    // alignItems: "center",
                }}
            >
                <Box sx={{ overflowX: "auto", width: "100%", display: "flex", paddingBottom: "10px", paddingTop: "10px" }}>
                    {/* Make it scrollable horizontally on mobile screens - start of code */}
                    <Button
                        size="sm"
                        component="a"
                        href={"/missions/" + row.missionName}
                        orientation="vertical"
                        sx={{ width: "40px", marginRight: "20px" }} // Adjust width as needed
                    >
                        <ArrowBackIosIcon />
                    </Button>

                    <MissionsInfoModal missionData={row} />

                    <CardContent
                        className="d-none d-sm-block"
                        sx={{
                            direction: "rtl",
                            // overflowY: "auto",
                            display: "flex",
                            justifyContent: "center",
                            alignContent: "center",
                        }}
                    >
                        <Typography
                            fontWeight="md"
                            sx={{ color: "#5A5C69", fontSize: "90%" }}
                        >
                            {row.expDate} | {row.belonging} |{" "}
                            {row.completedMicroMissions} /{" "}
                            {row.microMissions.length}
                        </Typography>
                    </CardContent>

                    <CardContent
                        sx={{
                            direction: "rtl",
                            justifyContent: "center",
                        }}
                    >
                        <Typography
                            fontWeight="md"
                            sx={{
                                color: "#5A5C69",
                                fontWeight: "bold",
                                fontSize: "100%",
                                maxWidth: "100%",
                                maxHeight: "8vh",
                            }}
                        >
                            {row.missionName}
                        </Typography>
                    </CardContent>
                    {/* Make it scrollable horizontally on mobile screens - end of code */}
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {row.isMissionDone ? (
                        <Chip
                            label="success"
                            color="success"
                            variant="solid"
                            className="ml-3"
                            sx={{
                                borderRadius: "20%",
                                width: "30px",
                                maxWidth: "30px",
                                maxHeight: "30px",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <DoneIcon sx={{ width: "100%" }} />
                        </Chip>
                    ) : (
                        <Chip
                            label="error"
                            color="danger"
                            variant="solid"
                            className="ml-3"
                            sx={{
                                borderRadius: "20%",
                                width: "30px",
                                maxWidth: "30px",
                                maxHeight: "30px",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <ClearIcon sx={{ width: "100%" }} />
                        </Chip>
                    )}
                </Box>

                <CardOverflow
                    color="primary"
                    sx={{
                        px: 0.8,
                        justifyContent: "center",
                        borderLeft: "1px solid",
                        borderColor: "divider",
                        alignItems: "center",
                    }}
                >
                    <Checkbox
                        checked={selectedMissions.indexOf(row.id) !== -1}
                        onChange={(event) => handleClick(event, row.id)}
                    />
                </CardOverflow>
            </Card>
        );
    });

    return (
        <div
            style={{
                maxHeight: "70vh",
                overflowY: "auto",
                paddingRight: "5px",
            }}
        >
            {" "}
            {/* Set a fixed height and make it scrollable */}
            {missions}
        </div>
    );
}
