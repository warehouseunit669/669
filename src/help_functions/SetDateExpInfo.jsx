export default function SetDateExpInfo(filesData) {
    // This function applies on every object in the list the number of expired item/almost expired/not expired rows in the file
    // params: filesData (Table's rows) -> Array[Object{key: Array[str], Object{key: Array[str], key: str, key: str, key: str, key: timestamp}]
    //
    // returns: filesData (Table's rows) -> Array[Object{key: Array[str], Object{key: Array[str], key: str, key: str, key: str, key: timestamp}]

    let datesCounter = {
        expiredRows: 0,
        almostExpiredRows: 0,
        unexpiredRows: 0,
    };

    for (let i = 0; i < filesData.length; i++) {
        if (filesData[i].items.length === 0) {
            filesData[i].datesCounter = {
                expiredRows: 0,
                almostExpiredRows: 0,
                unexpiredRows: 0,
            };
        } else {
            datesCounter = filesData[i].items.datesCounter;
            filesData[i].datesCounter = datesCounter;
        }
    }
    return filesData;
}
