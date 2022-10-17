import React, { useEffect, useState } from 'react'
// import ParseCsv from './function/HandleCsvFile'
import addIcebreakerToArray from './function/AddIcebreakerToArray'
import { DownloadCsv } from './function/DownloadCsv'
import getParseCsvdata from './function/HandleCsvFile'

// Define interface for component props/api:
export interface DropZoneProps {
    onDragStateChange?: (isDragActive: boolean) => void
    onDrag?: () => void
    onDragIn?: () => void
    onDragOut?: () => void
    onDrop?: () => void
    onFilesDrop?: (files: File[]) => void
}

export const DropZone = React.memo(
    (props: React.PropsWithChildren<DropZoneProps>) => {
        const {
            onDragStateChange,
            onFilesDrop,
            onDrag,
            onDragIn,
            onDragOut,
            onDrop,
        } = props

        // Create state to keep track when dropzone is active/non-active:
        const [isDragActive, setIsDragActive] = React.useState(false)
        // Prepare ref for dropzone element:
        const dropZoneRef = React.useRef<null | HTMLDivElement>(null)
        const [updatedCsv, setUpdatedCsv] = useState(new File([], ""));
        const [downloadUrl, setDownloadUrl] = useState("");

        // Create helper method to map file list to array of files:
        const mapFileListToArray = (files: FileList) => {
            if (files === null) {
                return;
            }

            const array: File[] = []
            // console.log(files)

            for (let i = 0; i < files.length; i++) {
                if (files.item(i) !== null && files.item(i)?.name.match(/.\.csv$/)) { //wonky AF but works. add this to the onDrag method instead
                    ParseCsv(files.item(i)).then((appendedCsvFile) => {
                        if (appendedCsvFile !== null && appendedCsvFile) {
                            array.push(appendedCsvFile);
                        }
                    })
                }
            }

            return array;
        }

        async function ParseCsv(file: File | null) {
            if (file === null) {
                throw Error("we done goofed!");
            }

            if (!file.name.match(/.\.csv$/)) {
                throw new Error("File type not supported: " + file.name)
            }

            const reader = new FileReader();

            reader.addEventListener('load', function (e) {

                let csvdata: string = e.target!.result! as string;
                const parsedData: string[] = getParseCsvdata(csvdata!); // calling function for parse csv data 
                const arrayWithIcebreaker = addIcebreakerToArray(parsedData!);
                let stringifiedData: string = "";
                for (let i = 0; i < arrayWithIcebreaker.length; i++) {
                    stringifiedData = stringifiedData + arrayWithIcebreaker[i] + "\n";
                }
                // console.log(stringifiedData);
                const blob = new Blob([stringifiedData], { type: 'text/csv' });
                const newFile = new File([blob], "output.csv", { type: 'text/csv' })
                setUpdatedCsv(newFile);
                return newFile; //setState here instead? maybe a boolean for if it's loaded or not and a string for the csv content? use properties?
            });
            reader.readAsBinaryString(file);
            return updatedCsv; //parse into file here!
        }


        // useEffect(() => {
        //     // Download it
        //     const fileDownloadUrl = URL.createObjectURL(updatedCsv);
        //     setState({ fileDownloadUrl: fileDownloadUrl },
        //         () => {
        //             dofileDownload.click();
        //             URL.revokeObjectURL(fileDownloadUrl);  // free up storage--no longer needed.
        //             setState({ fileDownloadUrl: "" })
        //         })
        // })

        // Create handler for dragenter event:
        const handleDragIn = React.useCallback(
            (event: any) => {
                event.preventDefault()
                event.stopPropagation()
                onDragIn?.()

                if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
                    setIsDragActive(true)
                }
            },
            [onDragIn]
        )

        // Create handler for dragleave event:
        const handleDragOut = React.useCallback(
            (event: any) => {
                event.preventDefault()
                event.stopPropagation()
                onDragOut?.()

                setIsDragActive(false)
            },
            [onDragOut]
        )

        // Create handler for dragover event:
        const handleDrag = React.useCallback(
            (event: any) => {
                event.preventDefault()
                event.stopPropagation()

                onDrag?.()
                if (!isDragActive) {
                    setIsDragActive(true)
                }
            },
            [isDragActive, onDrag]
        )

        // Create handler for drop event:
        const handleDrop = React.useCallback(
            (event: any) => {
                event.preventDefault()
                event.stopPropagation()

                setIsDragActive(false)
                onDrop?.()

                let files: File[] = event.dataTransfer.files;
                if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                    files = mapFileListToArray(event.dataTransfer.files)!

                    onFilesDrop?.(files)
                    event.dataTransfer.clearData()
                }
            },
            [onDrop, onFilesDrop]
        )

        // Obser active state and emit changes:
        React.useEffect(() => {
            onDragStateChange?.(isDragActive)
        }, [isDragActive])

        // Attach listeners to dropzone on mount:
        React.useEffect(() => {
            const tempZoneRef = dropZoneRef?.current
            if (tempZoneRef) {
                tempZoneRef.addEventListener('dragenter', handleDragIn)
                tempZoneRef.addEventListener('dragleave', handleDragOut)
                tempZoneRef.addEventListener('dragover', handleDrag)
                tempZoneRef.addEventListener('drop', handleDrop)
            }

            // Remove listeners from dropzone on unmount:
            return () => {
                tempZoneRef?.removeEventListener('dragenter', handleDragIn)
                tempZoneRef?.removeEventListener('dragleave', handleDragOut)
                tempZoneRef?.removeEventListener('dragover', handleDrag)
                tempZoneRef?.removeEventListener('drop', handleDrop)
            }
        }, [])

        // Render <div> with ref and children:
        return <div ref={dropZoneRef}>{props.children}
            <DownloadCsv updatedCsvFile={updatedCsv} fileName="appendedCsv.csv"></DownloadCsv>);
        </div>
    }
)

DropZone.displayName = 'DropZone'