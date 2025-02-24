import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import UpdateRow from "../../help_functions/UpdateRow";
import DialogContent from "@mui/joy/DialogContent";
import Autocomplete from "@mui/joy/Autocomplete";
import EditIcon from "@mui/icons-material/Edit";
import ModalDialog from "@mui/joy/ModalDialog";
import FormControl from "@mui/joy/FormControl";
import DialogTitle from "@mui/joy/DialogTitle";
import FormLabel from "@mui/joy/FormLabel";
import Checkbox from "@mui/joy/Checkbox";
import Alert from "@mui/material/Alert";
import Button from "@mui/joy/Button";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import { Box } from "@mui/joy";
import React from "react";

function VisualizeTableTemplate() {
    const colHeaders = ["שם פריט", 'מק"ט', "כמות"];
    const itemsColWidth = 700 / colHeaders.length + "px";

    const colHeadersElements = colHeaders.map((item, index) => (
        <th
            style={{
                width: itemsColWidth,
                textAlign: "center",
                position: "sticky",
                top: 0,
                zIndex: 1,
                borderRight:
                    index < colHeaders.length - 1
                        ? "1px solid #DDDEF2"
                        : "none", // Add right border except for the last header
            }}
        >
            {item}
        </th>
    ));
    const tableData = (
        <tr>
            {Array(3)
                .fill()
                .map((_, index) => (
                    <td
                        // key={index}
                        style={{
                            width: itemsColWidth,
                            textAlign: "center",
                            direction: "rtl",
                            wordWrap: "break-word",
                            borderRight:
                                index < 2 ? "1px solid #DDDEF2" : "none", // Add right border except for the last cell
                        }}
                    >
                        ghjghj
                    </td>
                ))}
        </tr>
    );

    return (
        <Box sx={{ width: "100%" }}>
            <Sheet
                variant="outlined"
                sx={{
                    "--TableCell-height": "40px",
                    // the number is the amount of the header rows.
                    "--TableHeader-height": "calc(1 * var(--TableCell-height))",
                    "--Table-firstColumnWidth": "40px",
                    // '--Table-lastColumnWidth': '190px',
                    // background needs to have transparency to show the scrolling shadows
                    "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
                    "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
                    overflow: "auto",
                    backgroundSize:
                        "40px calc(100% - var(--TableCell-height)), 40px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height))",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "local, local, scroll, scroll",
                    backgroundPosition:
                        "var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height)",
                    backgroundColor: "background.surface",
                    borderRadius: "8px",
                    boxShadow: "none",
                    minHeight: "50vh",
                    maxHeight: "70vh",
                }}
            >
                <Table borderAxis="bothBetween" stripe="odd" hoverRow>
                    <thead>
                        <tr>{colHeadersElements}</tr>
                    </thead>
                    <tbody>{tableData}</tbody>
                </Table>
            </Sheet>
        </Box>
    );
}

export default function TemplateCreationModal({ makatimData }) {
    // CONSTANTS
    const cardTitle = "יצירת תבנית חדשה";
    const cardBody =
    "יצירת תבנית חדשה אומרת שאתם יכולים ליצור תבנית שמכילה חומרים מסוימים עם כמות שתגדירו שלאחר מכן תוכלו להדביק בתיק שלכם ולשבץ לאותם חומרים אצוות/סדרות קיימות מטבלת ניהול ציוד.";
    const submitButtonText = "הוספת תבנית";
    const cancelButtonText = "ביטול";
    
    // USE STATES
    const [open, setOpen] = React.useState(false);
    const [userOptionMakat, setUserOptionMakat] = React.useState({});

    // SPECIAL FUNCTIONS
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
                color="warning"
                onClick={() => setOpen(true)}
            >
                <SpaceDashboardIcon />
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
                                setOpen(false);
                            }
                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <Stack spacing={2} alignItems="flex-start">
                                    <Autocomplete
                                        multiple
                                        placeholder='חיפוש שם פריט / מק"ט...'
                                        id="select-makat"
                                        options={makatimData}
                                        getOptionLabel={(option) => option.items[1]}
                                        onChange={(event, newValue) => {
                                            setUserOptionMakat(newValue);
                                        }}
                                        required
                                    />
                                    <Button type="submit">Submit</Button>
                                </Stack>
                            </FormControl>
                            <FormControl>
                                {VisualizeTableTemplate()}
                            </FormControl>

                            <Button type="submit" color="primary">
                                {submitButtonText}
                            </Button>
                            <Button
                                variant="plain"
                                color="neutral"
                                onClick={() => setOpen(false)}
                            >
                                {cancelButtonText}
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </>
    );
}
