class LocalStorageHelper {
    // This class is used to save, get, update and remove data from localStorage.

    // Constructor to initialize the key
    constructor(key) {
        this.key = key;
    }

    // Save data to localStorage
    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    // Check if data exists in localStorage
    exists() {
        return localStorage.getItem(this.key) !== null;
    }

    // Get data from localStorage
    get() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : null;
    }

    // Update data in localStorage
    update(newData) {
        const existingData = this.get();
        if (existingData) {
            const updatedData = existingData.concat(newData);
            this.save(updatedData);
        } else {
            this.save([newData]);
        }
    }

    // Remove data from localStorage
    remove(item) {
        const existingData = this.get();
        if (existingData) {
            const updatedData = existingData.filter(data => data !== item);
            this.save(updatedData);
        }
    }
}

export default LocalStorageHelper;
