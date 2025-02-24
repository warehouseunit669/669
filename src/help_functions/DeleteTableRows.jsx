import {
    collection,
    query,
    where,
    writeBatch,
    doc,
    getDocs,
} from "firebase/firestore";
import LocalStorageHelper from "./LocalStorageHelper";
import DeleteRowsInFile from "./DeleteRowsInFile";
import { db } from "../firebase-config";

export default async function DeleteTableRows(
    selectedRows,
    allTableData,
    tableRowsState,
    collectionName,
) {
    // This function is responsible for the "post" request which deletes the selected rows in a certain table.
    // First we get the "collectionName" collection and filter it's documents by the id in the selected rows list (it must have an id key).
    // After getting the query (the reference), we use an async function to delete a batch of rows at once.
    // params: selectedRows     -> Array[string],
    //         allTableData     -> Array[Object{key: Array[string, string], key: string, key: string}],
    //         tableRowsState   -> useState()
    //         collectionName   -> string
    // returns: None.

    if (selectedRows.length === 0) return;

    let filesList = [];
    let selectedRowsCopy = [...selectedRows];

    // Create a new instance of LocalStorageHelper with the key collectionName.
    const localStorageHelper = new LocalStorageHelper(collectionName);

    // Make a general delete request to the firebase database
    const deleteRows = async (collectionToDelete, q, batch) => {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((document) => {
            batch.delete(doc(db, collectionToDelete, document.id));
            collectionToDelete === "equipment"
                ? filesList.push(document.data().fileAllocated)
                : null;
        });

        await batch.commit();
    };

    // Function to split an array into chunks
    const chunkArray = (myArray, chunk_size) => {
        let results = [];
        while (myArray.length) {
            results.push(myArray.splice(0, chunk_size));
        }
        return results;
    };

    // Split selectedRows into chunks of 30 items
    const selectedRowsChunks = await chunkArray(selectedRowsCopy, 30);

    for (let chunk of selectedRowsChunks) {
        const q = query(
            collection(db, collectionName),
            where("id", "in", chunk),
        );
        const batch = writeBatch(db);

        if (collectionName === "makatim") {
            // Delete rows in makatim table
            deleteRows(collectionName, q, batch).catch(console.error);

            // When you delete a row in the makatim table, the rows in the "equipment" table should be deleted also.
            const qEquipment = query(
                collection(db, "equipment"),
                where("idMakatim", "in", chunk),
            );
            const batchEquipment = writeBatch(db);
            await deleteRows("equipment", qEquipment, batchEquipment).catch(
                console.error,
            );

            // By the files list I can now know which rows to delete in the "files" table.
            const uniqueFilesList = [...new Set(filesList)];
            for (let i = 0; i < uniqueFilesList.length; i++) {
                if (uniqueFilesList[i] !== "") {
                    DeleteRowsInFile(
                        chunk,
                        tableRowsState,
                        "files",
                        uniqueFilesList[i],
                        null,
                        null,
                        "makatim",
                    );
                }
            }
        } else if (collectionName === "equipment") {
            await deleteRows(collectionName, q, batch).catch(console.error);

            const uniqueFilesList = [...new Set(filesList)];
            for (let i = 0; i < uniqueFilesList.length; i++) {
                if (uniqueFilesList[i] !== "") {
                    DeleteRowsInFile(
                        chunk,
                        tableRowsState,
                        "files",
                        uniqueFilesList[i],
                        null,
                        null,
                        "equipment",
                    );
                }
            }
        } else if (collectionName === "files") {
            deleteRows(collectionName, q, batch).catch(console.error);
        }
    }

    // After successfully deleting the documents, update the state
    const updatedData = allTableData.filter(
        (item) => !selectedRows.includes(item.id),
    );
    tableRowsState(updatedData);
    
    // Remove the data from localStorage
    localStorageHelper.save(updatedData);
}
