import React, { useState, useEffect } from "react";
import Papa, { parse } from "papaparse";

export const CsvUploadTab = () => {
  const PROMPT_OCCUPATION = "The person is working as ";
  const PROMPT_COMPANY = "The company is called ";
  const PROMPT_WORK_DESCRIPTION =
    "A description of the person's work would be: ";

  const [csvToUpload, setCsvToUpload] = useState<File | null>(null);
  const [csvToDownload, setCsvToDownload] = useState<string[][] | null>(null);
  const [parsedCsvToUpload, setParsedCsvToUpload] = useState<any>(null);
  const [fileName, setFileName] = useState<string>();

  function UploadButton() {
    const changeHandler = (event: React.FormEvent<HTMLInputElement>) => {
      console.log("we here now");
      const uploadedFile = (event.target as HTMLInputElement).files![0];
      setCsvToUpload(uploadedFile);
      setFileName(uploadedFile.name);
      const parsingCsv = async () => await ParseCsv(uploadedFile!);
      parsingCsv();
    };

    useEffect(() => {
      if (!parsedCsvToUpload) {
        return;
      }
      const headers: string[] = parsedCsvToUpload[0];
      const newArray = [["prompt", "completion"]];
      if (headers.indexOf("Job Title") !== -1) {
        const titleIndex = headers.indexOf("Job Title");
        const descriptionIndex = headers.indexOf("Description");
        const companyIndex = headers.indexOf("Company");
        const icebreakerIndex = headers.indexOf("Icebreaker");
        for (let i = 1; i < parsedCsvToUpload.length; i++) {
          let row = parsedCsvToUpload[i];
          const title: string = row[titleIndex].trim();
          const company: string = row[companyIndex].trim();
          const description: string = row[descriptionIndex].trim();
          const icebreaker: string = row[icebreakerIndex]
            .replaceAll("[job title]", title)
            .replaceAll("[company]", company)
            .trim();

          let prompt = title !== "" ? PROMPT_OCCUPATION + title + ".\n" : "";
          prompt += company !== "" ? PROMPT_COMPANY + company + ".\n" : "";
          prompt +=
            description !== ""
              ? PROMPT_WORK_DESCRIPTION + description + ".\n"
              : "";
          newArray.push([prompt + "\\n\\n###\\n\\n", " " + icebreaker + "###"]);
        }
      } else if (headers.indexOf("Summary") !== -1) {
        const summaryIndex = headers.indexOf("Summary");
        const icebreakerIndex = headers.indexOf("Icebreaker");
        for (let i = 1; i < parsedCsvToUpload.length; i++) {
          let row: string[] = parsedCsvToUpload[i];
          let prompt: string = row[summaryIndex];
          prompt = prompt.endsWith("\\n\\n###\\n\\n")
            ? prompt
            : prompt + "\\n\\n###\\n\\n";
          const icebreaker = row[icebreakerIndex].endsWith("###")
            ? " " + row[icebreakerIndex].trim()
            : " " + row[icebreakerIndex].trim() + "###";
          newArray.push([prompt, icebreaker]);
        }
      } else {
        throw new Error("something wrong with formatting, headers incorrect");
      }
      console.log("set csv to download");
      setCsvToDownload(newArray);
      //DO THE POST PARSING HANDLING HERE!
    }, []);

    async function ParseCsv(file: File | null) {
      if (file === null) {
        throw Error("File cannot be null or empty");
      }

      if (!file.name.match(/^.+\.csv$/)) {
        throw new Error("File type not supported: " + file.name);
      }

      parse(file, {
        complete: function (results, file) {
          setParsedCsvToUpload(results.data);
        },
      });
    }

    useEffect(() => {
      if (
        csvToDownload === null ||
        fileName === null ||
        parsedCsvToUpload === null
      ) {
        return;
      }
      const unparsedFile = Papa.unparse(csvToDownload);
      const blob = new Blob([unparsedFile]);
      const outputName = fileName.match(/^.+\.csv$/)
        ? fileName.toLowerCase().replaceAll(/\s/g, "_")
        : `${fileName.toLowerCase().replaceAll(/\s/g, "_")}.csv`;
      const fileToDownload = new File([blob], outputName);
      console.log(
        `Trying to download file ${JSON.stringify(unparsedFile)} \nFilesize: ${
          fileToDownload.size
        }`
      );
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(fileToDownload);
      downloadFile(url, outputName);
      setParsedCsvToUpload(null);
      setFileName(null);
      setCsvToUpload(null);
    }, [csvToDownload]);

    return (
      <div>
        <label
          className={`ease-in-out duration-300 inline-block py-2 px-8 border-2 border-primary text-primary font-semibold text-lg rounded-lg mt-5 hover:bg-violet-500 hover:border-violet-500 hover:text-white w-full mt-4`}
        >
          <input type="file" onChange={changeHandler} hidden={true} />
          Upload CSV
        </label>
      </div>
    );
  }

  return <UploadButton></UploadButton>;
};

export function downloadFile(href: string, name: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

CsvUploadTab.displayName = "csvupload";
