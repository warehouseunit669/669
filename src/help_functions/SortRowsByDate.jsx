export default function SortRowsByDate(tableData, isSorted, desiredSort="Creation Date") {
    // This function gets a tableData array of all the rows in the current table,
    // sorts the array by date if isSorted is true, and reverse the sort action if it's false.
    // params: tableData    -> Array[Object{key: Array[string, string], key: string, key: string}],
    //         isSorted -> Boolean.

    if (!tableData || tableData.length === 0) return [];

    return [...tableData].sort((a, b) => {
        if (desiredSort === "Creation Date") {
            let firstBubble = parseInt(a.id, 36); // Timestamp of user a
            let secondBubble = parseInt(b.id, 36); // Timestamp of user b

            if (firstBubble === secondBubble) {
                return 0;
            } else if (firstBubble < secondBubble) {
                return isSorted ? -1 : 1;
            } else {
                return isSorted ? 1 : -1;
            }
        } else {
            let dateIndexA = a.items.length === 5 ? 1 : 0;
            let dateIndexB = b.items.length === 5 ? 1 : 0;

            let dateA = a.items[dateIndexA].split("/"); // Assuming date format is DD/MM/YYYY
            let dateB = b.items[dateIndexB].split("/"); // Assuming date format is DD/MM/YYYY

            let timestampA = new Date(
                `${dateA[2]}-${dateA[1]}-${dateA[0]}`,
            ).getTime();
            let timestampB = new Date(
                `${dateB[2]}-${dateB[1]}-${dateB[0]}`,
            ).getTime();

            if (timestampA === timestampB) {
                return 0;
            } else if (timestampA < timestampB) {
                return isSorted ? 1 : -1;
            } else {
                return isSorted ? -1 : 1;
            }
        }
    });
}
