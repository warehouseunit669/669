import Autocomplete, { createFilterOptions } from "@mui/joy/Autocomplete";
import LocalStorageHelper from "../../help_functions/LocalStorageHelper";
import getTable from "../../help_functions/GetTable";
import { addDoc, collection } from "firebase/firestore";
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

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// This function adds a row to the firebase equipment table
function AddRow(
    allTableData,
    tableRowsState,
    userOptionMakat,
    itemSidra,
    itemExpDate,
    collectionName,
) {
    // This function is responsible for the "post" request which adds arow for a certain table.
    // First we get the "collectionName" collection and check for duplicates, if there is, don't add the row.
    // Then add by async function the row to the firebase database and update the table rows' state accordingly.
    // params: allTableData     -> Array[Object{key: Array[string, string, string, string], key: string, key: string}],
    //         tableRowsState   -> useState()
    //         userOptionMakat  -> Object{key: Array[string, string, string, string], key: string, key: string}
    //         itemSidra        -> string
    //         itemExpDate      -> Object()
    //         collectionName   -> string
    // returns: None.

    // check for duplicates in allTableData in "אצווה / סדרה" and the user's input
    let isDuplicate = false;

    for (let i = 0; i < allTableData.length; i++) {
        if (allTableData[i].items[2] === itemSidra) {
            isDuplicate = true;
            break;
        }
    }

    // add row to db if there are no duplicates
    if (!isDuplicate) {
        // Create a new instance of LocalStorageHelper with the key collectionName.
        const localStorageHelper = new LocalStorageHelper(collectionName);
        const collectionRef = collection(db, collectionName);
        const idGenerated = Date.now().toString(36);
        const idMakatim = userOptionMakat.id;

        // Create the new item
        const new_item = [
            `${itemExpDate.$D}/${itemExpDate.$M + 1}/${itemExpDate.$y}`,
            itemSidra,
            userOptionMakat.items[0],
            userOptionMakat.items[1],
        ];

        const createRow = async () => {
            // Add doc to the collection
            await addDoc(collectionRef, {
                id: idGenerated,
                idMakatim: idMakatim,
                fileAllocated: "",
                items: new_item,
            });

            // Update the localStorage
            localStorageHelper.update({
                id: idGenerated,
                idMakatim: idMakatim,
                fileAllocated: "",
                items: new_item,
            });
        };

        createRow();
        tableRowsState((prevData) => [
            ...prevData,
            { items: new_item, id: idGenerated },
        ]);
    }
}

// This function is responsible for rendering the modal which sends the data to AddRow()
export default function AddRowMakatimModal({ tableData, tableState }) {
    const [makatimData, setMakatimData] = React.useState([{}]);
    const [userOptionMakat, setUserOptionMakat] = React.useState({});
    const [itemSidra, setItemSidra] = React.useState("");
    const [itemExpDate, setExpDate] = React.useState("");
    const [open, setOpen] = React.useState(false);

    // Get the makatim data from db so the user will choose it's item
    getTable(setMakatimData, "makatim");

    // Filter the options in the AutoComplete to contain an option with 2 values: the name of the item and it's makat.
    const filterOptions = createFilterOptions({
        matchFrom: "any",
        stringify: (option) => option.items[0] + option.items[1],
    });

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
                        יצירת פריט חדש מהסוג הזה תאפשר גישה אליו בדפים אחרים
                        באתר
                    </DialogContent>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            setOpen(false);
                            AddRow(
                                tableData,
                                tableState,
                                userOptionMakat,
                                itemSidra,
                                itemExpDate,
                                "equipment",
                            );
                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>שם פריט / מק"ט</FormLabel>
                                <Autocomplete
                                    placeholder='חיפוש שם פריט / מק"ט...'
                                    id="filter-makat"
                                    options={makatimData}
                                    getOptionLabel={(option) => option.items[1]}
                                    filterOptions={filterOptions}
                                    onChange={(event, newValue) => {
                                        setUserOptionMakat(newValue);
                                    }}
                                    required
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>אצווה / סדרה</FormLabel>
                                <Input
                                    onChange={(e) =>
                                        setItemSidra(e.target.value)
                                    }
                                    placeholder="הקלדת אצווה / סדרה..."
                                    autoFocus
                                    required
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>תאריך תפוגה</FormLabel>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DemoContainer components={["DatePicker"]}>
                                        <DatePicker
                                            label="בחרו תאריך"
                                            format="DD-MM-YYYY"
                                            sx={{ direction: "ltr" }}
                                            slotProps={{
                                                textField: { required: true },
                                            }}
                                            onChange={(newValue) =>
                                                setExpDate(newValue)
                                            }
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
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
