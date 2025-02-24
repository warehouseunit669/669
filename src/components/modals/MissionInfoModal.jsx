import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import WorkIcon from "@mui/icons-material/Work";
import DoneIcon from "@mui/icons-material/Done";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import { Link } from "react-router-dom";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import Chip from "@mui/joy/Chip";
import Box from "@mui/joy/Box";
import React from "react";

export default function MissionsInfoModal({ missionData }) {
    // This modal shows the mission information.
    // It shows the following list:
    // Mission's name
    // To whom it belongs to
    // Expiration date
    // Mission's status - missions left
    // Related file
    //
    // params: missionData -> Array[Object{key: value, Array[Object{key: value}]}]
    // Returns: None.

    const [isModalOpen, setOpen] = React.useState(false);
    return (
        <>
            <IconButton edge="start" onClick={() => setOpen(true)}>
                <InfoOutlinedIcon />
            </IconButton>

            <Modal
                sx={{ direction: "rtl", textAlign: "right" }}
                open={isModalOpen}
                onClose={() => setOpen(false)}
            >
                <ModalDialog
                    aria-labelledby="nested-modal-title"
                    aria-describedby="nested-modal-description"
                    sx={(theme) => ({
                        [theme.breakpoints.only("xs")]: {
                            top: "unset",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            borderRadius: 0,
                            transform: "none",
                            maxWidth: "unset",
                        },
                    })}
                >
                    <Typography id="nested-modal-title" level="h2">
                        {missionData.isMissionDone ? (
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
                        {missionData.missionName}
                    </Typography>
                    <Typography
                        id="nested-modal-description"
                        textColor="text.tertiary"
                    >
                        שייכות: {missionData.belonging}
                    </Typography>
                    <Typography
                        id="nested-modal-description"
                        textColor="text.tertiary"
                    >
                        תוקף המשימה: {missionData.expDate}
                    </Typography>
                    <Typography
                        id="nested-modal-description"
                        textColor="text.tertiary"
                    >
                        משימות שבוצעו: {missionData.completedMicroMissions} /{" "}
                        {missionData.microMissions.length}
                    </Typography>
                    <Typography
                        id="nested-modal-description"
                        textColor="text.tertiary"
                    >
                        תיק משובץ:{" "}
                        {missionData.fileName === "" ? (
                            "אין"
                        ) : (
                            <>
                                <br />
                                <Button
                                    className="mt-2"
                                    component={Link}
                                    to={"/files/" + missionData.fileName}
                                >
                                    <WorkIcon className="ml-2" />
                                    {missionData.fileName}
                                </Button>
                            </>
                        )}
                    </Typography>
                    <Box
                        sx={{
                            mt: 1,
                            display: "flex",
                            gap: 1,
                            flexDirection: { xs: "column", sm: "row-reverse" },
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="neutral"
                            onClick={() => setOpen(false)}
                        >
                            סגירה
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </>
    );
}
