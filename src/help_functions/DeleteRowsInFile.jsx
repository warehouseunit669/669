import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
} from "firebase/firestore";
import GetExpiredRows from "./GetExpiredRows";
import { db } from "../firebase-config";

export default function DeleteRowsInFile(
    selectedRows,
    tableRowsState,
    collectionName,
    fileName,
    equipmentData,
    equipmentState,
    currentPageName,
) {
    // This function is responsible for the "post" request which deletes selected rows in a certain table.
    // First we get the "collectionName" collection and filter it's documents' items by the id in the selected rows list (it must have an id key).
    // After getting the query (the reference) by the "fileName", we use an async function to delete a batch of rows at once.
    // params: selectedRows     -> Array[string],
    //         tableRowsState   -> useState()
    //         collectionName   -> string
    //         fileName         -> string
    //         equipmentData    -> Array[Object{key: Array[string, string, string, string], key: string, key: string}],
    //         equipmentState   -> useState(),
    //         currentPageName  -> string
    //
    // returns: None.

    if (selectedRows.length === 0) return;

    let updatedDoc;
    let currentDoc;
    let desiredItemIndex;
    let updatedTableData;

    const deleteRow = async () => {
        // Create a query which identify a document based on it's file name
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(
            query(collectionRef, where("fileName", "==", fileName)),
        );

        let selectedRowsEquipIds = [];

        // Update the document by filtering the "items" key in it by the id's in the selected rows list
        querySnapshot.forEach(async (doc) => {
            currentDoc = doc.data();
            for (let i = 0; i < selectedRows.length; i++) {
                if (currentPageName === "makatim") {
                    // desiredItemIndex = currentDoc.items.findIndex((item) => {
                        //     selectedRowsMakatimIds.push(item.idMakatim);
                        //     return item.idMakatim === selectedRows[i];
                        // });
                    updatedDoc = currentDoc;
                    updatedDoc.items = [];
                    for (let j = 0; j < currentDoc.items.length; j++) {
                        if (currentDoc.items[j].idMakatim !== selectedRows[i]) {
                            updatedDoc.items.push(currentDoc.items[j]);
                        }
                    }
                } else if (currentPageName === "equipment") {
                    desiredItemIndex = currentDoc.items.findIndex((item) => {
                        selectedRowsEquipIds.push(item.idEquipment);
                        return item.idEquipment === selectedRows[i];
                    });
                } else {
                    desiredItemIndex = currentDoc.items.findIndex((item) => {
                        selectedRowsEquipIds.push(item.idEquipment);
                        return item.id === selectedRows[i];
                    });
                }

                if (desiredItemIndex > -1 && currentPageName !== "makatim") {
                    // only splice array when item is found
                    currentDoc.items.splice(desiredItemIndex, 1);
                }
            }

            // Fetch the request by updating the "items" key with the filtered list
            await updateDoc(doc.ref, {
                items: currentPageName === "makatim" ? updatedDoc.items : currentDoc.items,
            });

            // If the page name is "equipment"/"makatim" I will not want to update the state of the files page because im not there.
            if (
                currentPageName === "equipment" ||
                currentPageName === "makatim"
            ) {
                return;
            }

            // Update table state
            updatedTableData = currentDoc.items;
            tableRowsState(GetExpiredRows(updatedTableData));
        });

        // If the page name is "equipment"/"makatim" I will not want to update the "fileAllocation" key because the row is already deleted from the table.
        if (currentPageName === "equipment" || currentPageName === "makatim") {
            return;
        }

        // Update the equipment's "fileAllocation" key to "" - Remember, we delete it from the file so the equipment's item is now free.
        const equipCollectionRef = collection(db, "equipment");
        const equipQuerySnapshot = await getDocs(
            query(equipCollectionRef, where("id", "in", selectedRowsEquipIds)),
        );
        equipQuerySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, {
                // Use updateDoc to edit the fileAllocation
                fileAllocated: "",
            });

            // Update Equipment data state accordigly so the options will be rendered with the updated data.
            const updatedEquipmentData = equipmentData.map((item) => {
                if (selectedRowsEquipIds.includes(item.id)) {
                    item.fileAllocated = "";
                    return item;
                } else {
                    return item;
                }
            });
            equipmentState(updatedEquipmentData);
        });
    };

    deleteRow();
}
