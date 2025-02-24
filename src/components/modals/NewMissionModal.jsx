import { addDoc, collection } from "firebase/firestore";
import DialogContent from "@mui/joy/DialogContent";
import ModalDialog from "@mui/joy/ModalDialog";
import { useNavigate } from "react-router-dom";
import FormControl from "@mui/joy/FormControl";
import DialogTitle from "@mui/joy/DialogTitle";
import FormLabel from "@mui/joy/FormLabel";
import { db } from "../../firebase-config";
import Add from "@mui/icons-material/Add";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import Stack from "@mui/joy/Stack";
import React from "react";

export default function NewMissionModal() {
    // This function is responsible for displaying the modal which adds a new mission.
    // params: tableData        -> Array[Object{key: Array[string, string], key: string, key: string}],
    //         tableState       -> useState([{}]).

    const [open, setOpen] = React.useState(false);
    const [missionName, setMissionName] = React.useState("");
    const navigate = useNavigate();

    const cardTitle = "יצירת משימה חדשה";
    const cardBody =
        "ברגע יצירת משימה חדשה תועברו לדף שבו תוכלו להוסיף עוד פרטים בנוגע למשימה, אם אתם לא בטוחים בשם המשימה תמיד תוכלו לעדכן אותה אחר כך.";
    const inputLabel1Text = "שם המשימה";
    const submitButtonText = "הוספה";
    const collectionName = "missions";

    function addNewMission(newMissionName) {
        // This function adds a new mission to the "missions" table.
        // By creating a new mission, some keys will have a default values.
        // params: newMissionName   -> string
        //
        // returns: None.

        const collectionName = "missions";
        const missionsCollectionRef = collection(db, collectionName);
        const id_generated = Date.now().toString(36);

        const createNewMission = async () => {
            await addDoc(missionsCollectionRef, {
                id: id_generated,
                belonging: "ללא",
                expDate: "ללא",
                fileName: "",
                isMissionDone: false,
                missionName: newMissionName,
                microMissions: [],
            });
        };

        createNewMission();
        // Navigate to the new route with the file name
        navigate(`/missions/${newMissionName}`);
    }

    return (
        <>
            <Button
                className="w-100"
                variant="outlined"
                color="success"
                onClick={() => setOpen(true)}
            >
                <Add />
            </Button>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                sx={{ textAlign: "right", direction: "rtl" }}
            >
                <ModalDialog>
                    <DialogTitle>{cardTitle}</DialogTitle>
                    <DialogContent>{cardBody}</DialogContent>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            setOpen(false);
                            addNewMission(missionName);
                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>{inputLabel1Text}</FormLabel>
                                <Input
                                    onChange={(e) =>
                                        setMissionName(e.target.value)
                                    }
                                    autoFocus
                                    required
                                />
                            </FormControl>
                            <Button type="submit" color="primary">
                                {submitButtonText}
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </>
    );
}
