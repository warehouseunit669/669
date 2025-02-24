import { addDoc, collection } from "firebase/firestore";
import DialogContent from "@mui/joy/DialogContent";
import ModalDialog from "@mui/joy/ModalDialog";
import FormControl from "@mui/joy/FormControl";
import DialogTitle from "@mui/joy/DialogTitle";
import { useNavigate } from "react-router-dom";
import FormLabel from "@mui/joy/FormLabel";
import { db } from "../../firebase-config";
import Add from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import Stack from "@mui/joy/Stack";
import React from "react";

export default function NewFileModal(props) {
    const filesData = props.filesData;
    const fileDataState = props.filesDataState;
    const navigate = useNavigate();
    const todayTimeStamp = new Date();
    const dd = String(todayTimeStamp.getDate());
    const mm = String(todayTimeStamp.getMonth() + 1); //January is 0!
    const yyyy = todayTimeStamp.getFullYear();
    const todayDate = dd + "/" + mm + "/" + yyyy;

    const [open, setOpen] = React.useState(false);
    const [fileName, setFileName] = React.useState("");
    const [isDuplicate, setDuplicate] = React.useState(false); // State for showing the alert

    function CreateNewFile(
        filesData,
        fileDataState,
        newFileName,
        todayDate,
        setOpen,
        setDuplicate,
    ) {
        // This function creates a new and blank file (bag) in the firebase database.
        // params: filesData     -> Array[Object{key: Array[str], Object{key: Array[str], key: str, key: str, key: str, key: timestamp}],
        //         newFileName   -> string,
        //         todayDate     -> string
        //         setDuplicate  -> React.useState()

        const collectionName = "files";
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
            const collectionRef = collection(db, collectionName);
            const id_generated = Date.now().toString(36);

            const createFile = async () => {
                await addDoc(collectionRef, {
                    createDate: todayDate,
                    fileName: newFileName,
                    id: id_generated,
                    items: [
                        {
                            idMakatim: "",
                            idEquipment: "",
                            items: [
                                "המקט שלי",
                                "התיאור שלי",
                                "הסדרה שלי",
                                "תאריך התפוגה שלי",
                            ],
                        },
                    ],
                });

                // Navigate to the new route with the file name
                navigate(`/files/${newFileName}`, {
                    state: { fileName: newFileName },
                });
            };

            createFile();
            setOpen(false); // Close the modal after creating the file
            fileDataState((prevData) => [
                ...prevData,
                {
                    createDate: todayDate,
                    fileName: newFileName,
                    id: id_generated,
                    items: [
                        {
                            idMakatim: "",
                            idEquipment: "",
                            items: [
                                "המקט שלי",
                                "התיאור שלי",
                                "הסדרה שלי",
                                "תאריך התפוגה שלי",
                            ],
                        },
                    ],
                },
            ]);
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
            <Button
                className="w-100"
                variant="solid"
                color="success"
                onClick={() => setOpen(true)}
            >
                <Add sx={{ color: "#ffffff" }} />
            </Button>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                sx={{ textAlign: "right", direction: "rtl" }}
            >
                <ModalDialog>
                    <DialogTitle>יצירת תיק חדש</DialogTitle>
                    <DialogContent>
                        לאחר יצירת תיק חדש, התיק יפתח ותהיה אפשרות לערוך אותו.
                    </DialogContent>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            {
                                isDuplicate && setOpen(false);
                            }
                            CreateNewFile(
                                filesData,
                                fileDataState,
                                fileName,
                                todayDate,
                                setOpen,
                                setDuplicate,
                            );
                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>שם התיק</FormLabel>
                                <Input
                                    id="file-name-input"
                                    placeholder="שם התיק..."
                                    onChange={(e) =>
                                        setFileName(e.target.value)
                                    }
                                    autoFocus
                                    required
                                />
                            </FormControl>
                            <FormControl>
                                <Input
                                    disabled
                                    placeholder={"תאריך יצירה: " + todayDate}
                                    required
                                />
                            </FormControl>
                            <Button type="submit" color="primary">
                                הוספה
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
