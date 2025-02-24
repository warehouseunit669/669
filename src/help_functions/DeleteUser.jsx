import {
    collection,
    getDocs,
    query,
    where,
    writeBatch,
    doc,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";

export default function DeleteUser(
    selectedUsers,
    tableData,
    tableState,
    collectionName,
) {
    // This function is responsible for deleting a user from the database.
    // It will delete it from the table of the current page, from the
    // "users" table and from the authentication list in firebase.
    // params: selectedUsers -> Array[str],
    //         tableState    -> useState().
    // returns: None.

    if (selectedUsers.length === 0) return;

    const base_url = "http://localhost:3000";
    let usersId = [];

    // Make a general delete request to the firebase database
    const deleteRows = async (collectionName, q, batch) => {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((document) => {
            // Add the user id to the list of users to be deleted
            usersId.push(document.data().userId);

            // Delete the user from the authentication list
            batch.delete(doc(db, collectionName, document.id));
        });
        // Send a POST request to the server
        fetch(`${base_url}/deleteUsers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(usersId),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log("Users deleted successfully");
                    console.log("Data:", data.data);
                } else {
                    console.log("Error deleting users: ", data.data);
                }
            })
            .catch((error) => {
                console.log("Error deleting users: ", error);
            });
        await batch.commit();
    };

    const q = query(
        collection(db, collectionName),
        where("id", "in", selectedUsers),
    );
    const batch = writeBatch(db);
    deleteRows(collectionName, q, batch).catch(console.error);
}
