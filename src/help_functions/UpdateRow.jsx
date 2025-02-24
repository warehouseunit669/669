import {
    updateDoc,
    getDocs,
    query,
    where,
    collection,
} from "firebase/firestore";
import LocalStorageHelper from "./LocalStorageHelper";
import { db } from "../firebase-config";

async function UpdateByEquipment(
    newRowData,
    tableRowsState,
    equipQuerySnapshot,
    filesCollectionRef,
) {
    // This function updates the equipment and files collections with the new sidra/expDate.
    // newRowData's type must be -> Object{id: "someid", idMakatim: "someid", fileAllocated: "somefile", items: [newExpDate, newSidra, newMakat, newName]}
    // Params: newRowData             -> Object{id: "someid", idMakatim: "someid", fileAllocated: "somefile", items: [newExpDate, newSidra, newMakat, newName]},
    //         tableRowsState         -> useState(),
    //         makatimQuerySnapshot   -> QuerySnapshot,
    //         equipQuerySnapshot     -> QuerySnapshot,
    //         filesCollectionRef     -> CollectionReference.
    //
    // Returns: None.

    let fileAllocated = newRowData.fileAllocated;
    const localStorageHelper = new LocalStorageHelper("equipment");

    // Update the equipment collection with the new sidra/expDate
    equipQuerySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
            items: [
                newRowData.items[0], // Update the first element with newExpDate
                newRowData.items[1], // Update the second element with newSidra
                ...doc.data().items.slice(2, 4), // Keep the last 2 elements unchanged
            ],
        });
    });

    // If the file is allocated to the equipment, update the file with the new sidra/expDate
    if (fileAllocated !== "") {
        // get the file data with a query that is allocated to the equipment
        const filesQuerySnapshot = await getDocs(
            query(filesCollectionRef, where("fileName", "==", fileAllocated)),
        );

        // Update the file collection with the new sidra/expDate
        filesQuerySnapshot.forEach(async (doc) => {
            // Get the document data
            const docData = doc.data();

            for (let i = 0; i < docData.items.length; i++) {
                // Find the desired item index that needs to be updated
                if (docData.items[i].idEquipment === newRowData.id) {
                    // If the desired item index is found, update the item
                    docData.items[i].items[0] = newRowData.items[0]; // Update the third element with newExpDate
                    docData.items[i].items[1] = newRowData.items[1]; // Update the fourth element with newSidra
                    await updateDoc(doc.ref, {
                        items: docData.items,
                    });
                }
            }
        });
    }

    // Update the table rows' state with the new makat/name
    const newItems = (prevData) =>
        prevData.map((row) =>
            // If current row's makat is equals to new row makat
            row.id === newRowData.id ? newRowData : row,
        );
    tableRowsState(newItems);

    localStorageHelper.save(localStorageHelper.get().filter((row) => row.id !== newRowData.id));
    localStorageHelper.update(newRowData);
}

async function UpdateByMakatim(
    newRowData,
    tableRowsState,
    makatimQuerySnapshot,
    equipQuerySnapshot,
    filesCollectionRef,
) {
    // This function updates the makatim, equipment and fiels collections with the new makat/name.
    // newRowData's type must be -> Object{id: "someid", items: [newMakat, newName]}
    // Params: newRowData             -> Object{id: "someid", items: [newMakat, newName]},
    //         tableRowsState         -> useState(),
    //         makatimQuerySnapshot   -> QuerySnapshot,
    //         equipQuerySnapshot     -> QuerySnapshot,
    //         filesCollectionRef     -> CollectionReference.
    //
    // Returns: None.

    let fileAllocated = "";
    const localStorageHelper = new LocalStorageHelper("makatim");

    // Update the equipment collection with the new makat/name
    equipQuerySnapshot.forEach(async (doc) => {
        const docData = doc.data();
        fileAllocated = docData.fileAllocated;
        await updateDoc(doc.ref, {
            items: [
                ...doc.data().items.slice(0, 2), // Keep the first 2 elements unchanged
                newRowData.items[0], // Update the third element with newMakat
                newRowData.items[1], // Update the fourth element with newName
            ],
        });
    });

    // If the file is allocated to the equipment, update the file with the new makat/name
    if (fileAllocated !== "") {
        // get the file data with a query that is allocated to the equipment
        const filesQuerySnapshot = await getDocs(
            query(filesCollectionRef, where("fileName", "==", fileAllocated)),
        );

        // Update the file collection with the new makat/name
        filesQuerySnapshot.forEach(async (doc) => {
            // Get the document data
            const docData = doc.data();

            for (let i = 0; i < docData.items.length; i++) {
                // Find the desired item index that needs to be updated
                if (docData.items[i].idMakatim === newRowData.id) {
                    // If the desired item index is found, update the item
                    docData.items[i].items[2] = newRowData.items[0]; // Update the third element with newMakat
                    docData.items[i].items[3] = newRowData.items[1]; // Update the fourth element with newName
                    await updateDoc(doc.ref, {
                        items: docData.items,
                    });
                }
            }
        });
    }

    // Update the makatim collection with the new makat/name
    makatimQuerySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
            items: newRowData.items,
        });
    });

    // Update the table rows' state with the new makat/name
    const newItems = (prevData) =>
        prevData.map((row) =>
            // If current row's makat is equals to new row makat
            row.id === newRowData.id ? newRowData : row,
        );
    tableRowsState(newItems);

    // Save the new data to localStorage
    localStorageHelper.save(localStorageHelper.get().filter((row) => row.id !== newRowData.id));
    localStorageHelper.update(newRowData);
}

function CheckForDuplicates(allTableData, newRowData, collectionName) {
    // Check if there are duplicates for the new row data in allTableData.
    // Params: allTableData     -> Array[Object{}],
    //         newRowData       -> Object{},
    //         collectionName   -> String.
    //
    // Returns: Boolean.

    for (let i = 0; i < allTableData.length; i++) {
        // If collection name is "makatim" check for duplicates.
        if (collectionName === "makatim") {
            let itemName = newRowData.items[1];
            let itemMakat = newRowData.items[0];

            if (
                (allTableData[i].items.includes(itemName) ||
                    allTableData[i].items.includes(itemMakat)) &&
                allTableData[i].id !== newRowData.id
            )
                return true;
        } else if (collectionName === "equipment") {
            let itemSidra = newRowData.items[1];

            if (
                allTableData[i].items.includes(itemSidra) &&
                allTableData[i].id !== newRowData.id
            )
                return true;
        }
    }

    return false;
}

export default async function UpdateRow(
    allTableData,
    tableRowsState,
    newRowData,
    collectionName,
    setDuplicate,
    setModalOpen,
) {
    // This function updates a row in a firebase table.
    // First we get the collection and check for duplicates, if there are, don't update the row.
    // Then if it's all good, update the row by an async function to the firebase database and update the table rows' state accordingly.
    // params: allTableData     -> Array[Object{key: Array[string, string], key: string, key: string}],
    //         tableRowsState   -> useState(),
    //         newRowData       -> Object{},
    //         collectionName   -> string,
    //         setDuplicate     -> useState().
    // returns: None.

    // add row to db
    if (!CheckForDuplicates(allTableData, newRowData, collectionName)) {
        // Get the collection reference
        const makatimCollectionRef = collection(db, "makatim");
        const equipCollectionRef = collection(db, "equipment");
        const filesCollectionRef = collection(db, "files");

        // Get the query snapshot
        const makatimQuerySnapshot = await getDocs(
            query(makatimCollectionRef, where("id", "==", newRowData.id)),
        );

        // If collection is "makatim",
        if (collectionName === "makatim") {
            // Get the query snapshot
            const equipQuerySnapshot = await getDocs(
                query(
                    equipCollectionRef,
                    where("idMakatim", "==", newRowData.id),
                ),
            );

            // newRowData's type must be -> Object{id: rowId, items: [newMakat, newName]}
            UpdateByMakatim(
                newRowData,
                tableRowsState,
                makatimQuerySnapshot,
                equipQuerySnapshot,
                filesCollectionRef,
            );
        } else if (collectionName === "equipment") {
            // Get the query snapshot
            const equipQuerySnapshot = await getDocs(
                query(equipCollectionRef, where("id", "==", newRowData.id)),
            );

            // newRowData's type must be -> Object{id: rowId, idMakatim: itemIdMakatim, fileAllocated: itemFileAddressed , items: [itemExpDate, itemSidra, itemMakat, itemName]}
            UpdateByEquipment(
                newRowData,
                tableRowsState,
                equipQuerySnapshot,
                filesCollectionRef,
            );
        }

        setModalOpen(false);
    } else {
        // Set state to display the alert
        setDuplicate(true);
        // Close the modal after 6 seconds
        setTimeout(() => {
            setDuplicate(false);
        }, 6000);
    }
}
