import UpdateUserLevel from "../help_functions/UpdateUserLevel";
import Checkbox from "@mui/joy/Checkbox";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import "../css/table-template.css";
import Box from "@mui/joy/Box";
import React from "react";

export default function TableTemplate(props) {
    // This component is responsible for displaying a chart (aka table) on the page.
    // This component is "general" as it can be, meaning you can use this component for different pages and different lengths of columns.
    // For the TableTemplate to render perfectly, you should consider that the rowsData "key: Array[str]" length and the colHeaders length should be equal.
    // Props needed: rowsData (Table's rows)            -> Array[Object{key: Array[str], key: str, key: str}]
    //               colHeaders (Table's headers)       -> List[string]
    //               selectedRows  (user rows selected) -> List[string]
    //               setSelectedRowsState               -> React.useState()

    const rows = props.rowsData;
    const colHeaders = props.colHeaders;
    const selected = props.selectedRows;
    const setSelectedRows = props.setSelectedRowsState;
    const currentPage = props.currentPage;

    // Initialize state for levels
    const [levelStates, setLevelStates] = React.useState([]);

    // Total table size in pixels: 737.
    const checkboxColWidth = "37px";
    const itemsColWidth = 700 / colHeaders.length + "px";

    // Handle changing the level for a specific row
    const handleLevelChange = (index, value) => {
        // Update the state of levels
        const updatedLevels = [...levelStates];
        updatedLevels[index] = value;
        setLevelStates(updatedLevels);

        // Call any additional functions here if needed
        UpdateUserLevel(rows[index].id, rows[index], value);
    };

    // Create table headers.
    const tableHeaders = colHeaders.map((item) => (
        <th
            style={{
                width: itemsColWidth,
                textAlign: "center",
                position: "sticky",
                top: 0,
                zIndex: 1,
            }}
        >
            {item}
        </th>
    ));

    // Create table rows.
    const tableData = rows.map((row, rowIndex) => {
        const rowColor = row.bgColor;

        // If the current page is equipment, I want to add the file allocated to the rows
        if (currentPage === "equipment" && row.items.length === 4) {
            row.items.unshift(
                row.fileAllocated === "" ? "-" : row.fileAllocated,
            );
        }

        return (
            <tr>
                {row.items.map((item, index) => {
                    // If the current page is users-management and the index is 0, I want to add a select component to the rows
                    // to change the user's level.
                    // The select component is disabled for the first row (the header row).
                    // Inedex 0 is the level column only for the users-management page.
                    if (currentPage === "users-management" && index === 0) {
                        return (
                            <td
                                style={{
                                    width: itemsColWidth,
                                    textAlign: "center",
                                    direction: "rtl",
                                    wordWrap: "break-word",
                                    backgroundColor: rowColor,
                                }}
                            >
                                <Select
                                    value={levelStates[rowIndex] || item}
                                    color="primary"
                                    disabled={false}
                                    size="sm"
                                    onChange={(event) => {
                                        handleLevelChange(
                                            rowIndex,
                                            event.target.textContent,
                                        );
                                        UpdateUserLevel(
                                            rowIndex,
                                            event.target.textContent,
                                        );
                                    }}
                                    variant="outlined"
                                >
                                    <Option value={"1"}>1</Option>
                                    <Option value={"2"}>2</Option>
                                    <Option value={"3"}>3</Option>
                                </Select>
                            </td>
                        );
                    }
                    return (
                        <td
                            key={index}
                            style={{
                                width: itemsColWidth,
                                textAlign: "center",
                                direction: "rtl",
                                wordWrap: "break-word",
                                backgroundColor: rowColor,
                            }}
                        >
                            {item}
                        </td>
                    );
                })}
                <td style={{ width: checkboxColWidth, textAlign: "center" }}>
                    <Checkbox
                        checked={selected.indexOf(row.id) !== -1}
                        onChange={(event) => handleClick(event, row.id)}
                    />
                </td>
            </tr>
        );
    });

    // Handle the select all button in the table.
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id);
            setSelectedRows(newSelecteds);
            return;
        }
        setSelectedRows([]);
    };

    // Handle a single row selection.
    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelectedRows(newSelected);
    };

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
                <Table
                    borderAxis="bothBetween"
                    stripe="odd"
                    hoverRow
                    sx={{
                        "& tr > *:last-of-type": {
                            position: "sticky",
                            right: 0,
                            boxShadow: "1px 0 var(--TableCell-borderColor)",
                            bgcolor: "background.surface",
                        },
                    }}
                >
                    <thead>
                        <tr>
                            {tableHeaders}
                            <th
                                style={{
                                    width: checkboxColWidth,
                                    textAlign: "center",
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1,
                                }}
                            >
                                <Checkbox
                                    indeterminate={
                                        selected.length > 0 &&
                                        selected.length < rows.length
                                    }
                                    checked={
                                        rows.length > 0 &&
                                        selected.length === rows.length
                                    }
                                    onChange={handleSelectAllClick}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>{tableData}</tbody>
                </Table>
            </Sheet>
        </Box>
    );
}
