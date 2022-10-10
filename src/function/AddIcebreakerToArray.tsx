

export default function addIcebreakerToArray(array: string[]) {
    const addedHeaderValues: string = ",IceBreaker1, IceBreaker2, IceBreaker3";
    array[0] = array[0].replaceAll(/\r/g, "") + addedHeaderValues;

    for (let i = 1; i < array.length; i++) {
        array[i] = array[i].replaceAll(/\r/g, "") + ",\"Hello, blabla\",\"Hi there, blabla\",\"Olá, blabla\"";
    }

    console.log(array);
    return array;
}

// function populateTable(row: string, add: string) {
//     const lastvalue = row.pop();
//     const cleanedLastvalue = lastvalue?.replaceAll(/\r/g, "");
//     const iceBreakervalues: string[] = [cleanedLastvalue!].concat(add);
//     return row.concat(iceBreakervalues);
// }