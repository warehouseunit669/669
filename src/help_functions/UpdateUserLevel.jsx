import {
    collection,
    getDocs,
    updateDoc,
    query,
    where,
} from "firebase/firestore";
import { db } from "../firebase-config";
import React from "react";

export default function UpdateUserLevel(userId, userData, selectedLevel) {
    const collectionName = "users";
    const availableOptions = ["1", "2", "3"];

    // If the selectedLevel not in available options exit the function.
    if (!availableOptions.includes(selectedLevel)) {
        return;
    }

    // Modify the items to the desired selected level
    userData.items[0] = selectedLevel;

    const updateUserLevel = async () => {
        // Update the equipment's "items" key
        const usersCollectionRef = collection(db, collectionName);
        const usersQuerySnapshot = await getDocs(
            query(usersCollectionRef, where("id", "==", userId)),
        );
        usersQuerySnapshot.forEach(async (doc) => {
            await updateDoc(doc.ref, {
                // Use updateDoc to update the items
                items: userData.items,
            });
        });
    };

    updateUserLevel();
}
