import { collection, getDocs, onSnapshot } from "firebase/firestore";
import LocalStorageHelper from "./LocalStorageHelper";
import { db } from "../firebase-config";
import React from "react";

export default function getTable(tableState, collectionName) {
    // Get the "collectionName" table from the firebase database.
    // Allocate the data to the state useState() by the name of the collection.
    // Example for table data:
    // [
    //     [{"items":["962029809","מהדקי בד בקהאוז 135 מ\"מ"],"id":"lvv217na","docRef":"00wVmgpfcHoKLZmOdh8T"},
    //     {items: ['שם', 'מקט'], id: 'lsa4cdxg', docRef: '7eke9GC6NTAPahAbQMRs'}]
    // ]
    // params: tableState     -> useState([{}]),
    //         collectionName -> string.

    // Create a new instance of LocalStorageHelper with the key collectionName.
    const localStorageHelper = new LocalStorageHelper(collectionName);

    React.useEffect(() => {
        const collectionRef = collection(db, collectionName);
        // Check if the data exists in localStorage.
        if (localStorageHelper.exists()) {
            tableState(localStorageHelper.get());
        } else {

            const getData = async () => {
                // Get the data from the firebase database.
                const data = await getDocs(collectionRef);
                const initData = data.docs.map((doc) => ({
                    ...doc.data(),
                    docRef: doc.id,
                }));
                tableState(initData);

                // Store data in localStorage
                localStorageHelper.save(initData);
            };

            getData();
        }

        // Set up the real-time listener
        const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
            const updatedData = snapshot.docs.map((doc) => ({
                ...doc.data(),
                docRef: doc.id,
            }));

            // Only update state and local storage if the data has changed
            if (
                JSON.stringify(updatedData) !==
                JSON.stringify(localStorageHelper.get())
            ) {
                tableState(updatedData);
                localStorageHelper.save(updatedData);
            }
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);
}
