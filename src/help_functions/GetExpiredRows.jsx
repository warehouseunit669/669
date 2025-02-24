export default function GetExpiredRows(tableData) {
    // This function adds a "bgColor" key to every element in the tableData
    // based on it's date.
    // red element      - expired date
    // yellow element   - 30 days before expiration date
    // white element    - over 30 days before expiration date
    //
    // params: tableData - Array[Object{key: Array[string], key: string, key: string}]

    if (!tableData) return [];
    if (tableData.length === 0) return [];

    const yellowColor = "#FFFEDA";
    const redColor = "#FFE3E3";
    const whiteColor = "#FBFCFE";

    const daysWarningLimit = 30;
    const today = new Date();
    const dd = String(today.getDate());
    const mm = String(today.getMonth() + 1); //January is at 0 index!
    const yyyy = today.getFullYear();
    const todayDate = mm + "/" + dd + "/" + yyyy;

    let newTableData = [];
    let dateIndex;
    let datesCounter = {
        expiredRows: 0,
        almostExpiredRows: 0,
        unexpiredRows: 0,
    };

    for (let i = 0; i < tableData.length; i++) {
        tableData[i].items.length === 5 ? (dateIndex = 1) : (dateIndex = 0);

        let dateParts = tableData[i].items[dateIndex].split("/"); // Assuming date format is DD/MM/YYYY
        let usrDate = new Date(
            `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`,
        ).getTime();
        let currentDate = new Date(todayDate).getTime();
        let differenceInTime = usrDate - currentDate;
        let differenceInDays = differenceInTime / (1000 * 3600 * 24); // Difference in days

        if (currentDate > usrDate) {
            datesCounter.expiredRows += 1;
            newTableData.push({ ...tableData[i], bgColor: redColor });
        } else if (differenceInDays > daysWarningLimit) {
            datesCounter.unexpiredRows += 1;
            newTableData.push({ ...tableData[i], bgColor: whiteColor });
        } else if (differenceInDays <= daysWarningLimit) {
            datesCounter.almostExpiredRows += 1;
            newTableData.push({ ...tableData[i], bgColor: yellowColor });
        }
    }
    newTableData.datesCounter = datesCounter;

    return newTableData;
}
