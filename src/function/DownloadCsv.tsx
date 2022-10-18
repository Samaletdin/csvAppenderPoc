import React from "react";
import { useState } from "react";
import { useDownloadBlob } from "../component/DownloadFileProps";
import { Button, ButtonState } from "../component/ButtonState";
import { Alert, Container } from "react-bootstrap";

export const DownloadCsv: React.FC<{ updatedCsvFile: Blob, fileName: string }> = ({ updatedCsvFile, fileName }) => { //is this the top layer?? import Dropzone here? how TF do I share values between classes?
    const [buttonState, setButtonState] = useState<ButtonState>(
        ButtonState.Primary
    );
    console.log("We downloading! Here is file: " + updatedCsvFile)

    // const [updatedCsvFile, setUpdatedCsvFile] = useState(filefile)
    const [showAlert, setShowAlert] = useState<boolean>(false);

    const preDownloading = () => setButtonState(ButtonState.Loading);
    const postDownloading = () => setButtonState(ButtonState.Primary);

    const onErrorDownloadFile = () => {
        setButtonState(ButtonState.Primary);
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    const getFileName = () => {
        return "remember_to_set_name_sample-file.csv";
    };

    const { ref, url, download, name } = useDownloadBlob({
        preDownloading,
        postDownloading,
        onError: onErrorDownloadFile,
        getFileName,
    }, updatedCsvFile);

    return (
        <Container className="mt-5">
            <Alert variant="danger" show={showAlert}>
                Something went wrong. Please try again!
            </Alert>
            <a href={url} download={name} className="hidden" ref={ref} />
            <Button label="Download" buttonState={buttonState} onClick={download} />
        </Container>
    );
};