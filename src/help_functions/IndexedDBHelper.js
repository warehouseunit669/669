import { openDB } from "idb";

class IndexedDBHelper {
    constructor(storeName) {
        this.dbName = "medi-cali"; // Database name, similar to Firebase database
        this.storeName = storeName; // Collection name, similar to Firebase collection

        const version = localStorage.getItem("dbVersion") || 1;
        localStorage.setItem("dbVersion", version + 1);

        this.dbPromise = openDB(dbName, version, {
            upgrade(db, oldVersion, newVersion, transaction) {
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
            },
        });
    }

    // Save data to IndexedDB
    async save(data) {
        if (!Array.isArray(data)) {
            console.error("Invalid data: expected an array: ", data);
            return;
        }

        const db = await this.dbPromise;

        if (!db.objectStoreNames.contains(this.storeName)) {
            console.error(
                `Object store ${this.storeName} does not exist in the database.`,
            );
            return;
        }

        const tx = db.transaction(this.storeName, "readwrite");
        const store = tx.objectStore(this.storeName);
        await Promise.all(data.map((item) => store.put(item)));
        await tx.done;
    }

    // Check if data exists in IndexedDB
    async exists() {
        try {
            const db = await this.dbPromise;
            const tx = db.transaction(this.storeName, "readonly");
            const store = tx.objectStore(this.storeName);
            const count = await store.count();
            return count > 0;
        } catch (error) {
            console.error("Failed to count records:", error);
            return false;
        }
    }

    // Get data from IndexedDB
    async get() {
        const db = await this.dbPromise;
        return await db.getAll(this.storeName);
    }

    // Update data in IndexedDB
    async update(newData) {
        const existingData = await this.get();
        const updatedData = existingData.concat(newData);
        await this.save(updatedData);
    }

    // Remove data from IndexedDB
    async remove() {
        const db = await this.dbPromise;
        const tx = db.transaction(this.storeName, "readwrite");
        tx.objectStore(this.storeName).clear();
        await tx.done;
    }
}

export default IndexedDBHelper;
