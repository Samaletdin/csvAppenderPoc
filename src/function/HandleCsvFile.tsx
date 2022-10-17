import { useState } from "react";
import addIcebreakerToArray from './AddIcebreakerToArray'



// export default async function ParseCsv(file: File | null) {
//     const [updatedCsv, setUpdatedCsv] = useState(new File([], ""));
//     if (file === null) {
//         throw Error("we done goofed!");
//     }

//     if (!file.name.match(/.\.csv$/)) {
//         throw new Error("File type not supported: " + file.name)
//     }

//     const reader = new FileReader();

//     reader.addEventListener('load', function (e) {

//         let csvdata: string = e.target!.result! as string;
//         const parsedData: string[] = getParsecsvdata(csvdata!); // calling function for parse csv data 
//         const arrayWithIcebreaker = addIcebreakerToArray(parsedData!);
//         let stringifiedData: string = "";
//         for (let i = 0; i < arrayWithIcebreaker.length; i++) {
//             stringifiedData = stringifiedData + arrayWithIcebreaker[i] + "\n";
//         }
//         console.log(stringifiedData);
//         const blob = new Blob([stringifiedData], { type: 'text/csv' });
//         const newFile = new File([blob], "output.csv", { type: 'text/csv' })
//         setUpdatedCsv(newFile);
//         return newFile; //setState here instead? maybe a boolean for if it's loaded or not and a string for the csv content? use properties?
//     });
//     reader.readAsBinaryString(file);
//     return updatedCsv; //parse into file here!
// }

export default function getParsecsvdata(data: string) {
    let parsedData = [];

    let newLinebrk = data.split("\n");
    for (let i = 0; i < newLinebrk.length; i++) {

        parsedData.push(newLinebrk[i])
    }

    console.table(parsedData)
    return parsedData
}

