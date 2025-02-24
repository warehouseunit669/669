export default function SortFiles(filesData, desiredSort, isSorted) {
    // This function sorts the files list by a given parameter.
    // It can sort the files by most expired rows, expired in 30 days, not expired, and total items.
    // The sort will go from top to bottom or from bottom to top based on the "isSorted" boolean.
    // params: filesData        -> Array[Object{key: Array[str], Object{key: Array[str], key: str, key: str, key: str, key: timestamp}]
    //         desiredSort      -> string
    //         isSorted         -> Boolean
    //
    // returns: Array[Object{key: Array[str], Object{key: Array[str], key: str, key: str, key: str, key: timestamp}].

    let temp;
    let firstBubble;
    let secondBubble;

    for (let i = 0; i < filesData.length; i++) {
        for (let j = 0; j < filesData.length - 1; j++) {
            if (desiredSort === "Expired Rows") {
                firstBubble = filesData[j].datesCounter.expiredRows;
                secondBubble = filesData[j + 1].datesCounter.expiredRows;
            } else if (desiredSort === "Almost Expired Rows") {
                firstBubble = filesData[j].datesCounter.almostExpiredRows;
                secondBubble = filesData[j + 1].datesCounter.almostExpiredRows;
            } else if (desiredSort === "Unexpired Rows") {
                firstBubble = filesData[j].datesCounter.unexpiredRows;
                secondBubble = filesData[j + 1].datesCounter.unexpiredRows;
            } else if (desiredSort === "Total Rows") {
                firstBubble =
                    filesData[j].datesCounter.unexpiredRows +
                    filesData[j].datesCounter.almostExpiredRows +
                    filesData[j].datesCounter.expiredRows;
                secondBubble =
                    filesData[j + 1].datesCounter.unexpiredRows +
                    filesData[j + 1].datesCounter.almostExpiredRows +
                    filesData[j + 1].datesCounter.expiredRows;
            }

            if (isSorted) {
                if (firstBubble >= secondBubble) {
                    temp = filesData[j];
                    filesData[j] = filesData[j + 1];
                    filesData[j + 1] = temp;
                }
            } else {
                if (firstBubble <= secondBubble) {
                    temp = filesData[j];
                    filesData[j] = filesData[j + 1];
                    filesData[j + 1] = temp;
                }
            }
        }
    }

    return filesData;
}
