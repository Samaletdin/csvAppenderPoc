import React, { useCallback } from "react";
import addIcebreakerToArray from './AddIcebreakerToArray'


export default function parseCsv(file: File | null) {
    if (file === null) {
        return "only for compiling";
    }

    if (!file.name.match(/.\.csv$/)) {
        throw new Error("File type not supported: " + file.name)
    }

    const reader = new FileReader();
    reader.addEventListener('load', function (e) {

        let csvdata: string = e.target!.result! as string;
        const parsedData: string[] = getParsecsvdata(csvdata!); // calling function for parse csv data 
        const arrayWithIcebreaker = addIcebreakerToArray(parsedData!);
        let stringifiedData: string = "";
        for (let i = 0; i < arrayWithIcebreaker.length; i++) {
            stringifiedData = stringifiedData + arrayWithIcebreaker[i] + "\n";
        }
        console.log(stringifiedData)
        return stringifiedData; //setState here instead? maybe a boolean for if it's loaded or not and a string for the csv content? use properties?
    });
    reader.readAsBinaryString(file);
    // const parsed: string = useCallback(() => {
    //     Papa.parse(file, { complete: (result) => console.dir(result.data) }) 
    // }
    return "only for compiling"
}

function getParsecsvdata(data: string) {

    console.log(data);

    let parsedData = [];

    let newLinebrk = data.split("\n");
    for (let i = 0; i < newLinebrk.length; i++) {

        parsedData.push(newLinebrk[i])
    }

    console.table(parsedData)
    return parsedData
}

