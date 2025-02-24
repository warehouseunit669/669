import {
    collection,
    query,
    where,
    writeBatch,
    doc,
    getDocs,
} from "firebase/firestore";
import { db } from "../firebase-config";

export default async function GetFileTable(fileName, filesState) {
    const collectionName = "files";
    // Get the "files" table from the firebase database.
    // Allocate the data to the filesData useState() by the name of the file.
    // params:  filesState  -> useState([]),
    //          fileName    -> string.
    //
    // returns: Object{key: string, key: string, key: string, Array[Object{key: Array[string], key: string, key: string, key: string}]}

    const snapshot = await query(
        collection(db, collectionName),
        where("fileName", "==", fileName),
    );
    const querySnapshot = await getDocs(snapshot);

    // No matching documents.
    if (querySnapshot.empty) {
        return "";
    }

    // If there are documents, there must be only one because I don't allow more than one file with the same name.
    filesState(querySnapshot.docs[0].data());
}
