import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import DeleteUser from "../../help_functions/DeleteUser";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Delete from "@mui/icons-material/Delete";
import DialogTitle from "@mui/joy/DialogTitle";
import ModalDialog from "@mui/joy/ModalDialog";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import React from "react";

export default function DeleteUsersModal({
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

    const [open, setOpen] = React.useState(false);
    const warningText =
        "מחיקה של המשתמשים שנבחרו היא פעולה שלא ניתנת לשחזור, האם לבצע מחיקה בכל זאת?";
    const cardHeader = "אזהרה";
    const selectedRowsText = "נבחרו " + selectedRows.length + " שורות.";
    const deleteButtonText = "מחיקה";
    const cancelButtonText = "ביטול";

    return (
        <>
            <Button
                className="w-100"
                color="danger"
                onClick={() => setOpen(true)}
                disabled
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
                    <DialogContent>{warningText}</DialogContent>
                    <DialogActions>
                        <Button
                            variant="solid"
                            color="danger"
                            onClick={() => {
                                setOpen(false);
                                DeleteUser(
                                    selectedRows,
                                    tableData,
                                    tableState,
                                    collectionName,
                                );
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
