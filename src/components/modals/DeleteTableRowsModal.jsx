import ClearFileAllocation from "../../help_functions/ClearFileAllocation";
import DeleteRowsInFile from "../../help_functions/DeleteRowsInFile";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import DeleteTableRows from "../../help_functions/DeleteTableRows";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Delete from "@mui/icons-material/Delete";
import DialogTitle from "@mui/joy/DialogTitle";
import ModalDialog from "@mui/joy/ModalDialog";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import React from "react";

export default function DeleteTableRowsModal({
    selectedRows,
    selectedRowsState,
    tableData,
    tableState,
    collectionName,
    currentPageName,
    fileName,
    equipmentData,
    equipmentState,
}) {
    // This component is responsible for displaying the delete modal in the "/maktaim" page.
    // To delete anything from the table in the page there is a need to send 4 parameters.
    // params: selectedRows     -> Array[str],
    //         tableData        -> Array[Object{key: Array[string, string], key: string, key: string}],
    //         tableState       -> useState([{}]),
    //         collectionName   -> str,
    //         currentPageName  -> str,
    //         fileName         -> str,
    //         equipmentData    -> Array[Object{key: Array[string, string, string, string], key: string, key: string}],
    //         equipmentState   -> useState()

    const textByPage = {
        makatim:
            "מחיקה של שורות אלו יגרמו למחיקה שלהם בכל טבלה אחרת באתר, פעולה זו לא ניתנת לביטול לאחר ביצועה.",
        equipment:
            "מחיקה של שורות אלו יגרמו למחיקה שלהם בכל תיק אפשרי באתר, פעולה זו לא ניתנת לביטול לאחר ביצועה.",
        files: "מחיקה של תיק מוחקת גם את כל המידע בתוכו, אך לא מוחקת את המידע בטבלאות האב שלו.",
        file: "מחיקה של שורות אלו יגרמו למחיקה שלהן מהתיק הנוכחי.",
        missions:
            "מחיקה של המשימות שנבחרו היא פעולה שלא ניתנת לשחזור, האם לבצע מחיקה בכל זאת?",
    };

    const [open, setOpen] = React.useState(false);
    const cardHeader = "אזהרה";
    const selectedRowsText = "נבחרו " + selectedRows.length + " שורות.";
    const bodyText = textByPage[currentPageName];
    const deleteButtonText = "מחיקה";
    const cancelButtonText = "ביטול";

    return (
        <>
            <Button
                className="w-100"
                color="danger"
                onClick={() => setOpen(true)}
            >
                <Delete />
            </Button>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                sx={{ textAlign: "right", direction: "rtl" }}
            >
                <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle>
                        <WarningRoundedIcon />
                        {cardHeader}
                    </DialogTitle>
                    <Divider />
                    <DialogContent>{selectedRowsText}</DialogContent>
                    <DialogContent>{bodyText}</DialogContent>
                    <DialogActions>
                        <Button
                            variant="solid"
                            color="danger"
                            onClick={() => {
                                setOpen(false);
                                if (currentPageName === "makatim") {
                                    DeleteTableRows(
                                        selectedRows,
                                        tableData,
                                        tableState,
                                        collectionName,
                                    );
                                } else if (currentPageName === "equipment") {
                                    DeleteTableRows(
                                        selectedRows,
                                        tableData,
                                        tableState,
                                        collectionName,
                                    );
                                } else if (currentPageName === "files") {
                                    // This function call should come first because it has dependencies on the file's collection
                                    ClearFileAllocation(
                                        selectedRows,
                                        collectionName,
                                    );
                                    // Only then I can call this function
                                    DeleteTableRows(
                                        selectedRows,
                                        tableData,
                                        tableState,
                                        collectionName,
                                    );
                                } else if (currentPageName === "file") {
                                    DeleteRowsInFile(
                                        selectedRows,
                                        tableState,
                                        collectionName,
                                        fileName,
                                        equipmentData,
                                        equipmentState,
                                        currentPageName,
                                    );
                                }
                                selectedRowsState([]);
                            }}
                        >
                            {deleteButtonText}
                        </Button>
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={() => setOpen(false)}
                        >
                            {cancelButtonText}
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </>
    );
}
