import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditFileNameModal from "./modals/EditFileNameModal";
import CardOverflow from "@mui/joy/CardOverflow";
import CardContent from "@mui/joy/CardContent";
import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";
import Checkbox from "@mui/joy/Checkbox";
import Divider from "@mui/joy/Divider";
import { Button } from "@mui/joy";
import Card from "@mui/joy/Card";
import Chip from "@mui/joy/Chip";
import Box from "@mui/joy/Box";
import React from "react";

export default function ListTemplate(props) {
    // This component is responsible for the list of files rendered in the "/files" page.
    //
    // Props needed: filesData (Table's rows)           -> Array[Object{key: Array[str], Object{key: Array[str], key: str, key: str, key: str, key: timestamp}]
    //               selectedRows  (user rows selected) -> List[string]
    //               setSelectedRowsState               -> React.useState()

    const selected = props.selectedRows;
    const setSelectedRows = props.setSelectedRowsState;
    const filesData = props.filesData;
    const filesDataState = props.filesDataState;
    const userData = props.userData;

    const handleClick = (event, id) => {
        // Handle checkbox click function
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelectedRows(newSelected);
    };

    const filesRows = filesData.map((row) => {
        return (
            <Card
                className="mb-3"
                orientation="horizontal"
                variant="outlined"
                sx={{
                    width: "100%",
                    background: "#F9F9F9",
                    textAlign: "right",
                }}
            >
                {/* <CardOverflow className="d-none d-sm-block">
                    <AspectRatio ratio="1" sx={{ width: 90 }}>
                        <img
                            src="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90"
                            srcSet="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90&dpr=2 2x"
                            loading="lazy"
                            alt=""
                        />
                    </AspectRatio>
                </CardOverflow> */}
                <Button
                    size="sm"
                    component="a"
                    href={"/files/" + row.fileName}
                    orientation="vertical"
                    sx={{ width: "40px" }} // Adjust width as needed
                >
                    <ArrowBackIosIcon />
                    {/* Button content */}
                </Button>
                <CardContent sx={{ direction: "rtl", overflowY: "auto" }}>
                    <Box display="flex" alignItems="center">
                        <Typography
                            fontWeight="md"
                            textColor="success.plainColor"
                            sx={{
                                color: "#5A5C69",
                                fontWeight: "bold",
                                fontSize: "100%",
                                marginBottom: "6px",
                            }}
                        >
                            {row.fileName}
                        </Typography>
                        {(userData?.role === "1" || userData?.role === "2") && (
                            <EditFileNameModal
                                currentFileName={row.fileName}
                                filesData={filesData}
                                filesDataState={filesDataState}
                            />
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "fit-content",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: "sm",
                            bgcolor: "background.surface",
                            padding: "2px",
                            color: "text.secondary",
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
                            {row.datesCounter.expiredRows}
                        </Chip>
                        <Chip
                            variant="soft"
                            color="warning"
                            sx={{ margin: "3px", "--Chip-radius": "4px" }}
                        >
                            {row.datesCounter.almostExpiredRows}
                        </Chip>
                        <Chip
                            variant="soft"
                            color="success"
                            sx={{ margin: "3px", "--Chip-radius": "4px" }}
                        >
                            {row.datesCounter.unexpiredRows}
                        </Chip>
                        <Divider orientation="vertical" />
                        <Chip
                            variant="soft"
                            sx={{ margin: "3px", "--Chip-radius": "4px" }}
                        >
                            {row.datesCounter.unexpiredRows +
                                row.datesCounter.almostExpiredRows +
                                row.datesCounter.expiredRows}
                        </Chip>
                    </Box>
                </CardContent>
                <CardOverflow
                    color="primary"
                    sx={{
                        px: 0.8,
                        justifyContent: "center",
                        borderLeft: "1px solid",
                        borderColor: "divider",
                        alignItems: "center",
                        overflowY: "auto",
                    }}
                >
                    <Checkbox
                        checked={selected.indexOf(row.id) !== -1}
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
            {filesRows}
        </div>
    );
}
