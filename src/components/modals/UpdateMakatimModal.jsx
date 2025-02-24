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


export default function UpdateMakatimModal({ tableData, tableState, selectedRow }) {
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
        "עדכון פריט קיים ישנה את הפריט בכל הטבלאות הקיימות שהוא מופיע בהן.";
    const cardBodyWarning = "יש לבחור פריט אחד בלבד כדי לערוך אותו!"
    const inputLabel1Text = "שם פריט";
    const inputLabel2Text = 'מק"ט';
    const submitButtonText = "עדכון";
    const collectionName = "makatim";

    const rowData = (tableData.filter((row) => row.id === selectedRow[0]))[0];
    const rowId = !isObjectEmpty(rowData) ? rowData.id : "";

    const [itemName, setItemName] = React.useState("");
    const [itemMakat, setItemMakat] = React.useState("");
    const [isDuplicate, setDuplicate] = React.useState(false); // State for showing the alert
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (!isObjectEmpty(rowData)) {
            setItemName(rowData.items[1]);
            setItemMakat(rowData.items[0]);
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
                            const newRowData = {id: rowId, items: [itemMakat, itemName]}
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
                                <FormLabel>{inputLabel1Text}</FormLabel>
                                <Input
                                    defaultValue={!isObjectEmpty(rowData) ? rowData.items[1] : ""}
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
                                    defaultValue={!isObjectEmpty(rowData) ? rowData.items[0] : ""}
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
