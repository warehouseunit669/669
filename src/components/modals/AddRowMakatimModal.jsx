import LocalStorageHelper from "../../help_functions/LocalStorageHelper";
import { addDoc, collection } from "firebase/firestore";
import DialogContent from "@mui/joy/DialogContent";
import ModalDialog from "@mui/joy/ModalDialog";
import FormControl from "@mui/joy/FormControl";
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

function AddRow(
    allTableData,
    tableRowsState,
    itemName,
    itemMakat,
    collectionName,
    setDuplicate,
    setOpen,
) {
    // This function adds a row to the firebase table
    // This function is responsible for the "post" request which adds arow for a certain table.
    // First we get the "collectionName" collection and check for duplicates, if there are, don't add the row.
    // Then add the row by an async function to the firebase database and update the table rows' state accordingly.
    // params: allTableData     -> Array[Object{key: Array[string, string], key: string, key: string}],
    //         tableRowsState   -> useState()
    //         itemName         -> string
    //         itemMakat        -> string
    //         collectionName   -> string
    // returns: None.

    // check for duplicates in allTableData and the user's form data submission
    let isDuplicate = false;

    for (let i = 0; i < allTableData.length; i++) {
        if (
            allTableData[i].items.includes(itemName) ||
            allTableData[i].items.includes(itemMakat)
        ) {
            isDuplicate = true;
            break;
        }
    }

    // add row to db
    if (!isDuplicate) {
        const makatimCollectionRef = collection(db, collectionName);
        const id_generated = Date.now().toString(36);

        // Create a new instance of LocalStorageHelper with the key collectionName.
        const localStorageHelper = new LocalStorageHelper(collectionName);

        
        const createRow = async () => {
            // Add doc to the collection
            await addDoc(makatimCollectionRef, {
                id: id_generated,
                items: [itemMakat, itemName],
            });

            // Update the localStorage
            localStorageHelper.update({
                id: id_generated,
                items: [itemMakat, itemName],
            });
        };

        createRow();
        tableRowsState((prevData) => [
            ...prevData,
            { items: [itemMakat, itemName], id: id_generated },
        ]);
        setOpen(false);
    } else {
        // Set state to display the alert
        setDuplicate(true);
        // Close the modal after 6 seconds
        setTimeout(() => {
            setDuplicate(false);
        }, 6000);
    }
}

export default function AddRowMakatimModal({ tableData, tableState }) {
    // This function is responsible for displaying the "add row" modal which sends it's data to AddRow().
    // params: tableData        -> Array[Object{key: Array[string, string], key: string, key: string}],
    //         tableState       -> useState([{}]).

    const [open, setOpen] = React.useState(false);
    const [itemName, setItemName] = React.useState("");
    const [itemMakat, setItemMakat] = React.useState("");
    const [isDuplicate, setDuplicate] = React.useState(false); // State for showing the alert

    const cardTitle = "יצירת פריט חדש";
    const cardBody =
        "יצירת פריט חדש מהסוג הזה תאפשר גישה אליו בדפים אחרים באתר";
    const inputLabel1Text = "שם פריט";
    const inputLabel2Text = 'מק"ט';
    const submitButtonText = "הוספה";
    const collectionName = "makatim";

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
                            {
                                isDuplicate && setOpen(false);
                            }
                            AddRow(
                                tableData,
                                tableState,
                                itemName,
                                itemMakat,
                                collectionName,
                                setDuplicate,
                                setOpen,
                            );
                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>{inputLabel1Text}</FormLabel>
                                <Input
                                    onChange={(e) =>
                                        setItemName(e.target.value)
                                    }
                                    autoFocus
                                    required
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>{inputLabel2Text}</FormLabel>
                                <Input
                                    onChange={(e) =>
                                        setItemMakat(e.target.value)
                                    }
                                    required
                                />
                            </FormControl>
                            <Button type="submit" color="primary">
                                {submitButtonText}
                            </Button>
                        </Stack>
                    </form>
                    {isDuplicate && (
                        <Alert
                            severity="error"
                            sx={{
                                textAlign: "right",
                                direction: "rtl",
                                gap: 0.6,
                            }}
                        >
                            קיים פריט עם אותו שם או מק"ט!
                        </Alert>
                    )}
                </ModalDialog>
            </Modal>
        </>
    );
}
