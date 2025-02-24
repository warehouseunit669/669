import {
    updateDoc,
    getDocs,
    query,
    where,
    collection,
} from "firebase/firestore";
import DialogContent from "@mui/joy/DialogContent";
import ModalDialog from "@mui/joy/ModalDialog";
import FormControl from "@mui/joy/FormControl";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/joy/IconButton";
import DialogTitle from "@mui/joy/DialogTitle";

import FormLabel from "@mui/joy/FormLabel";
import { db } from "../../firebase-config";
import Add from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import Stack from "@mui/joy/Stack";
import React from "react";

export default function EditFileNameModal({
    currentFileName,
    filesData,
    filesDataState,
}) {
    const modalTitle = "עדכון שם תיק: " + currentFileName;
    const modalBody = "אנא בחרו שם תיק שאינו תפוס.";
    const inputLabel = "שם התיק החדש";
    
    const [open, setOpen] = React.useState(false);
    const [fileName, setFileName] = React.useState("");
    const [isDuplicate, setDuplicate] = React.useState(false); // State for showing the alert

    async function UpdateFileName(newFileName, setOpen, setDuplicate) {
        // This function creates a new and blank file (bag) in the firebase database.
        // params: filesData     -> Array[Object{key: Array[str], Object{key: Array[str], key: str, key: str, key: str, key: timestamp}],
        //         newFileName   -> string,
        //         todayDate     -> string
        //         setDuplicate  -> React.useState()

        let isDuplicate = false;

        // If the name of the new file already exist, don't create a new file
        for (let i = 0; i < filesData.length; i++) {
            if (filesData[i].fileName === newFileName) {
                isDuplicate = true;
                break;
            }
        }

        // Create a blank file in db if there is no duplications
        if (!isDuplicate) {
            const filesCollectionRef = collection(db, "files");
            const equipCollectionRef = collection(db, "equipment");
            const missionsCollectionRef = collection(db, "missions");

            const filesQuerySnapshot = await getDocs(
                query(
                    filesCollectionRef,
                    where("fileName", "==", currentFileName),
                ),
            );
            const equipQuerySnapshot = await getDocs(
                query(
                    equipCollectionRef,
                    where("fileAllocated", "==", currentFileName),
                ),
            );
            const missionsQuerySnapshot = await getDocs(
                query(
                    missionsCollectionRef,
                    where("fileName", "==", currentFileName),
                ),
            );

            filesQuerySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    fileName: newFileName,
                });
            });

            equipQuerySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    fileAllocated: newFileName,
                });
            });

            missionsQuerySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    fileName: newFileName,
                });
            });

            setOpen(false); // Close the modal after creating the file
            filesDataState((prevState) =>
                prevState.map((file) =>
                    file.fileName === currentFileName
                        ? { ...file, fileName: newFileName }
                        : file,
                ),
            );
        } else {
            // Set state to display the alert
            setDuplicate(true);
            // Close the modal after 6 seconds
            setTimeout(() => {
                setDuplicate(false);
            }, 6000);
        }
    }

    return (
        <>
            <IconButton
                onClick={() => setOpen(true)}
                variant="plain"
                className="mr-2 pb-2"
            >
                <EditIcon sx={{ width: "15px" }} />
            </IconButton>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                sx={{ textAlign: "right", direction: "rtl" }}
            >
                <ModalDialog>
                    <DialogTitle>{modalTitle}</DialogTitle>
                    <DialogContent>{modalBody}</DialogContent>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            {
                                isDuplicate && setOpen(false);
                            }
                            UpdateFileName(fileName, setOpen, setDuplicate);
                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>{inputLabel}</FormLabel>
                                <Input
                                    id="new-file-name-input"
                                    placeholder="שם התיק..."
                                    onChange={(e) =>
                                        setFileName(e.target.value)
                                    }
                                    autoFocus
                                    required
                                />
                            </FormControl>
                            <Button type="submit" color="primary">
                                שינוי שם התיק
                            </Button>
                        </Stack>
                    </form>
                    {/* Show the alert only when isDuplicate is true */}
                    {isDuplicate && (
                        <Alert
                            severity="error"
                            sx={{
                                textAlign: "right",
                                direction: "rtl",
                                gap: 0.6,
                            }}
                        >
                            קיים תיק עם שם זהה, הפעולה נכשלה!
                        </Alert>
                    )}
                </ModalDialog>
            </Modal>
        </>
    );
}
