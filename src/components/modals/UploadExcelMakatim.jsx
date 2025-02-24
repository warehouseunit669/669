import translationProps from "../../help_functions/translationProps.js";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";
import { collection, writeBatch, doc } from "firebase/firestore";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { db } from "../../firebase-config.jsx";
import Button from "@mui/joy/Button";
import React from "react";

export default function UploadExcelMakatim({ tableData, tableState }) {
    // This function is responsible for displaying the "add row" modal which sends it's data to AddRow().
    // params: tableData        -> Array[Object{key: Array[string, string], key: string, key: string}],
    //         tableState       -> useState([{}]).

    const [open, setOpen] = React.useState(false);
    const collectionName = "makatim";
    let uploadedData = [];

    function handleSubmit(data) {
        const validData = data.validData;
        let itemName;
        let itemMakat;
        let id_generated;

        const batch = writeBatch(db);

        // Make a general add request to the firebase database
        const createRows = async () => {
            for (let i = 0; i < validData.length; i++) {
                id_generated = Date.now().toString(36);
                itemName = validData[i].name;
                itemMakat = validData[i].makat;

                // Create a new array that doesn't include the current item
                const otherItems = validData.filter(
                    (item, index) => index !== i,
                );

                // Check if itemName and itemMakat already exist in otherItems
                const isDuplicate = otherItems.some(
                    (item) =>
                        item.name === itemName || item.makat === itemMakat,
                );
                if (isDuplicate) {
                    continue; // Skip this iteration and move to the next one
                }

                const docRef = doc(collection(db, collectionName));

                batch.set(docRef, {
                    id: id_generated,
                    items: [itemMakat, itemName],
                });

                await tableState((prevData) => [
                    ...prevData,
                    { items: [itemMakat, itemName], id: id_generated },
                ]);

                await setTimeout(() => {}, 50);
            }

            await batch.commit();
        };

        createRows();
    }

    const fields = [
        {
            // Visible in table header and when matching columns.
            label: "שם פריט",
            // This is the key used for this field when we call onSubmit.
            key: "name",
            // Allows for better automatic column matching. Optional.
            alternateMatches: [
                "שם פריט",
                "שם",
                "פריט",
                "שם פריט חדש",
                "פריטים",
                "שמות פריטים",
                "שמות פריט",
            ],
            // Used when editing and validating information.
            fieldType: {
                // There are 3 types - "input" / "checkbox" / "select".
                type: "input",
            },
            // Used in the first step to provide an example of what data is expected in this field. Optional.
            example: "אקמול",
            // Can have multiple validations that are visible in Validation Step table.
            validations: [
                {
                    // Can be "required" / "unique" / "regex"
                    rule: "required",
                    errorMessage: "יש להזין שם פריט",
                    // There can be "info" / "warning" / "error" levels. Optional. Default "error".
                    level: "error",
                },
            ],
        },
        {
            // Visible in table header and when matching columns.
            label: 'מק"ט',
            // This is the key used for this field when we call onSubmit.
            key: "makat",
            // Allows for better automatic column matching. Optional.
            alternateMatches: ['מק"ט', "מספר קטלוגי", "מקט", "מקטים", 'מק"טים'],
            // Used when editing and validating information.
            fieldType: {
                // There are 3 types - "input" / "checkbox" / "select".
                type: "input",
            },
            // Used in the first step to provide an example of what data is expected in this field. Optional.
            example: "123456789",
            // Can have multiple validations that are visible in Validation Step table.
            validations: [
                {
                    // Can be "required" / "unique" / "regex"
                    rule: "required",
                    errorMessage: 'יש להזין מק"ט',
                    // There can be "info" / "warning" / "error" levels. Optional. Default "error".
                    level: "error",
                },
            ],
        },
    ];

    return (
        <>
            <Button
                className="w-100"
                variant="outlined"
                color="primary"
                onClick={() => setOpen(true)}
            >
                <UploadFileIcon />
            </Button>
            {/* <Modal
                open={open}
                onClose={() => setOpen(false)}
                sx={{ textAlign: "right", direction: "rtl" }}
            > */}
            {open ? (
                <ReactSpreadsheetImport
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    onSubmit={handleSubmit}
                    fields={fields}
                    customTheme={{
                        components: {
                            Button: {
                                baseStyle: {
                                    borderRadius: "6px",
                                    direction: "rtl",
                                },
                                defaultProps: {
                                    colorScheme: "blue",
                                },
                            },
                            UploadStep: {
                                baseStyle: {
                                    direction: "rtl",
                                },
                            },

                            Modal: {
                                baseStyle: {
                                    dialog: {
                                        direction: "rtl",
                                    },
                                },
                            },
                        },
                    }}
                    translations={translationProps}
                    rowHook={(data, addError) => {
                        // Validation
                        for (let i = 0; i < tableData.length; i++) {
                            if (
                                tableData[i].items.includes(data.name) ||
                                tableData[i].items.includes(data.makat)
                            ) {
                                addError("name", {
                                    message: 'קיים פריט עם אותו שם או מק"ט!',
                                    level: "error",
                                });
                            }
                        }

                        if (data.name === "" || data.makat === "") {
                            addError("name", {
                                message: "תא הפריט ריק!",
                                level: "error",
                            });
                        }

                        // Check if the data is already in the uploadedData array
                        if (
                            uploadedData.some(
                                (item) =>
                                    item.name === data.name ||
                                    item.makat === data.makat,
                            )
                        ) {
                            addError("name", {
                                message:
                                    "קיים פריט עם אותו מידע באחד מהתאים בטבלה שאתם מנסים להעלות!",
                                level: "error",
                            });
                        }

                        uploadedData.push(data);
                        return data;
                    }}
                />
            ) : null}
        </>
    );
}
