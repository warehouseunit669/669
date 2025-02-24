import {
    updateDoc,
    arrayUnion,
    query,
    where,
    collection,
    getDocs,
} from "firebase/firestore";
import Autocomplete, { createFilterOptions } from "@mui/joy/Autocomplete";
import GetExpiredRows from "../../help_functions/GetExpiredRows";
import DialogContent from "@mui/joy/DialogContent";
import ModalDialog from "@mui/joy/ModalDialog";
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

function AddRowToFile(
    allTableData,
    tableRowsState,
    chosenItemObj,
    collectionName,
    fileName,
    equipmentData,
    equipmentState,
) {
    // This function adds a row to the firebase equipment table
    // This function is responsible for the "post" request which adds a row for a certain table.
    // First we get the "collectionName" collection and check for duplicates, if there is, don't add the row.
    // Then add by async function the row to the firebase database and update the table rows' state accordingly.
    // params: allTableData     -> Object{key: string, key: string, key: string, Array[Object{key: Array[string], key: string, key: string, key: string}]},
    //         tableRowsState   -> useState()
    //         chosenItemObj    -> Array[Object{key: Array[string], key: string, key: string, key: string}]
    //         collectionName   -> string
    //         fileName         -> string
    //         equipmentData    -> Array[Object{key: Array[string, string, string, string], key: string, key: string}]
    //         equipmentState   -> useState()
    //
    // returns: None.

    // check for duplicates in allTableData in "אצווה / סדרה" and the user's input
    let isDuplicate = false;

    if (allTableData.length > 0) {
        for (let i = 0; i < allTableData.length; i++) {
            for (let j = 0; j < allTableData[i].items.length; j++) {
                if (allTableData[i].items[j] === chosenItemObj.items[1]) {
                    isDuplicate = true;
                    break;
                }
            }

            if (isDuplicate) {
                break;
            }
        }
    }

    // add row to db if there are no duplicates
    if (!isDuplicate) {
        const idGenerated = Date.now().toString(36);
        const idMakatim = chosenItemObj.idMakatim;
        const idEquipment = chosenItemObj.id;
        const new_item = [
            chosenItemObj.items[0],
            chosenItemObj.items[1],
            chosenItemObj.items[2],
            chosenItemObj.items[3],
        ];

        const createRow = async () => {
            // Update the equipment's "fileAllocation" key
            const equipCollectionRef = collection(db, "equipment");
            const equipQuerySnapshot = await getDocs(
                query(equipCollectionRef, where("id", "==", chosenItemObj.id)),
            );
            equipQuerySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    // Use updateDoc to edit the fileAllocation
                    fileAllocated: fileName,
                });

                // Update Equipment data state accordigly so the options will be rendered with the updated data.
                const updatedEquipmentData = equipmentData.map((item) => {
                    if (item.id === chosenItemObj.id) {
                        item.fileAllocated = fileName;
                        return item;
                    } else {
                        return item;
                    }
                });
                equipmentState(updatedEquipmentData);
            });

            // Create a query which identify a document based on it's file name
            const collectionRef = collection(db, collectionName);
            const querySnapshot = await getDocs(
                query(collectionRef, where("fileName", "==", fileName)),
            );

            // Update the document by adding an element to it's items array
            querySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    // Use arrayUnion to push a new element to the existing array
                    items: arrayUnion({
                        id: idGenerated,
                        idEquipment: idEquipment,
                        idMakatim: idMakatim,
                        items: new_item,
                    }),
                });
            });
        };

        createRow();

        // Update table state
        const updatedTableData = [
            ...allTableData,
            {
                id: idGenerated,
                idEquipment: idEquipment,
                idMakatim: idMakatim,
                items: new_item,
            },
        ];
        tableRowsState(GetExpiredRows(updatedTableData));
    }
}

export default function AddRowFileModal({
    tableData,
    tableState,
    fileName,
    equipmentData,
    equipmentState,
}) {
    // This component is responsible for the modal rendering which sends the data to AddRow().
    // We will use the tableData to render the file's data to the table.
    // tableState will be used to update the table state fast.
    // fileName will help us seek for the right file in the tableData (which stores the data of all files).
    // equipmentData will let us explore every item from the equipment data page so we can add it to our file's table.
    //
    // params: tableData     -> Object{key: string, key: string, key: string, Array[Object{key: Array[string], key: string, key: string, key: string}]},
    //         tableState    -> useState(),
    //         fileName      -> string,
    //         equipmentData -> Array[Object{key: Array[string], key: string, key: string, key: string}].

    const [userOptionItem, setUserOptionItem] = React.useState({
        items: ["טרם נבחר", "טרם נבחר", "טרם נבחר", "טרם נבחר"],
    });
    const [open, setOpen] = React.useState(false);
    const collectionName = "files";

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
                    <DialogTitle>יצירת פריט חדש</DialogTitle>
                    <DialogContent>
                        יצירת פריט חדש מהסוג הזה יתווסף לתיק הנוכחי ויירש את
                        המידע מעמוד "ניהול ציוד", לכן במידה והפריט ימחק מעמוד
                        ניהול ציוד, הוא יימחק גם מהתיק הזה.
                    </DialogContent>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            setOpen(false);
                            AddRowToFile(
                                tableData,
                                tableState,
                                userOptionItem,
                                collectionName,
                                fileName,
                                equipmentData,
                                equipmentState,
                            );
                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>אצווה / סדרה</FormLabel>
                                <Autocomplete
                                    placeholder="חיפוש אצווה / סדרה..."
                                    id="filter-equipment"
                                    options={equipmentData
                                        .map((item) => {
                                            if (item.fileAllocated === "") {
                                                return item?.items[1];
                                            } else {
                                                return null;
                                            }
                                        })
                                        .filter((option) => option !== null)}
                                    onChange={(event, newValue) => {
                                        // Find the selected item in the equipmentData array
                                        const selectedItem = equipmentData.find(
                                            (item) =>
                                                item.items[1] === newValue,
                                        );
                                        // Render the data based on the selected item
                                        selectedItem
                                            ? setUserOptionItem(selectedItem)
                                            : null;
                                    }}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>שם פריט: </FormLabel>
                                <Input
                                    disabled
                                    placeholder={userOptionItem.items[3]}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>מק"ט: </FormLabel>
                                <Input
                                    disabled
                                    placeholder={userOptionItem.items[2]}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>תאריך תפוגה: </FormLabel>
                                <Input
                                    disabled
                                    placeholder={userOptionItem.items[0]}
                                />
                            </FormControl>
                            <Button type="submit" color="primary">
                                הוספה
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </>
    );
}
