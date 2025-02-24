import UpdateRow from "../../help_functions/UpdateRow";
import DialogContent from "@mui/joy/DialogContent";
import EditIcon from '@mui/icons-material/Edit';
import ModalDialog from "@mui/joy/ModalDialog";
import FormControl from "@mui/joy/FormControl";
import DialogTitle from "@mui/joy/DialogTitle";
import FormLabel from "@mui/joy/FormLabel";
import Alert from "@mui/material/Alert";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import Stack from "@mui/joy/Stack";
import React from "react";

import dayjs from 'dayjs'
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";


export default function UpdateEquipmentModal({ tableData, tableState, selectedRow }) {
    // This function is responsible for displaying the "add row" modal which sends it's data to AddRow().
    // params: tableData        -> Array[Object{key: Array[string, string], key: string, key: string}],
    //         tableState       -> useState([{}]),
    //         selectedRow      -> Array[string]. 

    const isObjectEmpty = (objectName) => {
        if (objectName == null) return true;
        return Object.keys(objectName).length === 0;
    }

    const cardTitle = "עדכון פריט קיים";
    const cardBody =
        'עדכון פריט קיים ישנה את הפריט בכל הטבלאות הקיימות שהוא מופיע בהן. בנוסף, כדי לערוך את שם הפריט או את המק"ט שלו, יש לפנות לעמוד - חומרים ומק"טים.';
    const cardBodyWarning = "יש לבחור פריט אחד בלבד כדי לערוך אותו!"
    const inputLabelName = "שם פריט";
    const inputLabelMakat = 'מק"ט';
    const inputLabelSidra = 'אצווה / סדרה';
    const inputLabelExpDate = 'תאריך תפוגה';
    const inputLabelFileAddressed = 'תיק משובץ';
    const submitButtonText = "עדכון";
    const collectionName = "equipment";

    const rowData = (tableData.filter((row) => row.id === selectedRow[0]))[0];
    const rowId = !isObjectEmpty(rowData) ? rowData.id : "";
    const itemName = !isObjectEmpty(rowData) ? rowData.items[4] : "";
    const itemMakat = !isObjectEmpty(rowData) ? rowData.items[3] : "";
    const itemExpDateYear = !isObjectEmpty(rowData) ? rowData.items[1].split("/")[2] : "";
    const itemExpDateMonth = !isObjectEmpty(rowData) ? (parseInt(rowData.items[1].split("/")[1]) - 1).toString() : "";
    const itemExpDateDay = !isObjectEmpty(rowData) ? rowData.items[1].split("/")[0] : "";
    const itemFileAddressed = !isObjectEmpty(rowData) ? rowData.fileAllocated : "";
    const itemIdMakatim = !isObjectEmpty(rowData) ? rowData.idMakatim : "";

    const [itemSidra, setItemSidra] = React.useState("");
    const [itemExpDate, setItemExpDate] = React.useState("");
    const [isDuplicate, setDuplicate] = React.useState(false); // State for showing the alert
    const [open, setOpen] = React.useState(false); // State for showing the modal

    React.useEffect(() => {
        if (!isObjectEmpty(rowData)) {
            setItemSidra(rowData.items[2]);
            setItemExpDate(rowData.items[1]);
        }
    }, [rowData]);

    return (
        <>
            <Button
                className="w-100"
                variant="outlined"
                color="warning"
                onClick={() => setOpen(true)}
            >
                <EditIcon />
            </Button>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                sx={{ textAlign: "right", direction: "rtl" }}
            >
                <ModalDialog>
                    <DialogTitle>{cardTitle}</DialogTitle>
                    <DialogContent>{selectedRow.length === 1 ? cardBody : cardBodyWarning}</DialogContent>
                    
                    {selectedRow.length === 1 &&
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            {
                                isDuplicate && setOpen(false);
                            }

                            // "newRowData" must be like an original item's format from the "makatim" table.
                            // For example: {id: "someid", items: ["makat", "name"]}
                            const newRowData = {id: rowId, idMakatim: itemIdMakatim, fileAllocated: itemFileAddressed , items: [itemExpDate, itemSidra, itemMakat, itemName]}
                            UpdateRow(
                                tableData,
                                tableState,
                                newRowData,
                                collectionName,
                                setDuplicate,
                                setOpen,
                            )
                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>{inputLabelName}</FormLabel>
                                <Input
                                    defaultValue={itemName}
                                    disabled
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>{inputLabelMakat}</FormLabel>
                                <Input
                                    defaultValue={itemMakat}
                                    disabled
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>{inputLabelSidra}</FormLabel>
                                <Input
                                    defaultValue={!isObjectEmpty(rowData) ? rowData.items[2] : ""}
                                    onChange={(e) =>
                                        setItemSidra(e.target.value)
                                    }
                                    autoFocus
                                    required
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>{inputLabelExpDate}</FormLabel>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DemoContainer components={["DatePicker"]}>
                                        <DatePicker
                                            // defaultValue={!isObjectEmpty(rowData) ? rowData.items[1] : ""}
                                            defaultValue={!isObjectEmpty(rowData) ? dayjs(new Date(itemExpDateYear, itemExpDateMonth, itemExpDateDay)) : ""}
                                            // value={!isObjectEmpty(rowData) ? rowData.items[1] : ""}
                                            label="בחרו תאריך"
                                            format="DD-MM-YYYY"
                                            sx={{ direction: "ltr" }}
                                            slotProps={{
                                                textField: { required: true },
                                            }}
                                            onChange={(newValue) =>
                                                setItemExpDate(`${newValue.$D}/${newValue.$M + 1}/${newValue.$y}`)
                                            }
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </FormControl>
                            <FormControl>
                                <FormLabel>{inputLabelFileAddressed}</FormLabel>
                                <Input
                                    defaultValue={itemFileAddressed === "" ? "-" : itemFileAddressed}
                                    disabled
                                />
                            </FormControl>
                            <Button type="submit" color="primary">
                                {submitButtonText}
                            </Button>
                        </Stack>
                    </form>}
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
