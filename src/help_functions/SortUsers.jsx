export default function SortUsers(usersData, desiredSort, isSorted) {
    // This function sorts the users list by a given parameter.
    // It can sort the files by most expired rows, expired in 30 days, not expired, and total items.
    // The sort will go from top to bottom or from bottom to top based on the "isSorted" boolean.
    // params: usersData        -> Array[Object{key: Array[str], Object{key: Array[str], key: str, key: str, key: str, key: timestamp}]
    //         desiredSort      -> string
    //         isSorted         -> Boolean
    //
    // returns: Array[Object{key: Array[str], Object{key: Array[str], key: str, key: str, key: str, key: timestamp}].

    return [...usersData].sort((a, b) => {
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
            let firstBubble = a.items.includes(desiredSort) ? 1 : 0; // Check if user a has the desired level
            let secondBubble = b.items.includes(desiredSort) ? 1 : 0; // Check if user b has the desired level

            if (firstBubble === secondBubble) {
                return 0;
            } else if (firstBubble < secondBubble) {
                return isSorted ? -1 : 1;
            } else {
                return isSorted ? 1 : -1;
            }
        }
    });
}
