import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";

export default async function ClearFileAllocation(
    selectedFilesList,
    collectionName,
) {
    // This function is responsible for clearing the "fileAllocation" key from all the
    // items in the equipment collection when a whole file is deleted.
    // 1. Get all the files by the id in the selected files list
    // 2. iterate over the selected files
    // 3. get all the idEquipment of all the items.
    // 4. clear "fileAllocation" from all items in the equipment by the idEquipment list.
    //
    // params: selectedFilesList -> List[str]
    //         collectionName    -> str
    //
    // returns: None.

    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(
        query(collectionRef, where("id", "in", selectedFilesList)),
    );

    let idEquipmentList = [];

    querySnapshot.forEach(async (doc) => {
        const docData = doc.data();
        for (let i = 0; i < docData.items.length; i++) {
            idEquipmentList.push(docData.items[i].idEquipment);
        }
    });

    // Update the equipment's "fileAllocation" key to "" - Remember, we delete it from the file so the equipment's item is now free.
    const equipCollectionRef = collection(db, "equipment");
    const equipQuerySnapshot = await getDocs(
        query(equipCollectionRef, where("id", "in", idEquipmentList)),
    );
    equipQuerySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, {
            // Use updateDoc to edit the fileAllocation
            fileAllocated: "",
        });
    });
}
