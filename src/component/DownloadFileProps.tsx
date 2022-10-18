import { useRef, useState } from "react";

interface DownloadFileProps {
    readonly preDownloading: () => void;
    readonly postDownloading: () => void;
    readonly onError: () => void;
    readonly getFileName: () => string;
}

interface DownloadedFileInfo {
    readonly download: () => Promise<void>;
    readonly ref: React.MutableRefObject<HTMLAnchorElement | null>;
    readonly name: string | undefined;
    readonly url: string | undefined;
}

export const useDownloadBlob = ({
    preDownloading,
    postDownloading,
    onError,
    getFileName,
}: DownloadFileProps, blob: Blob): DownloadedFileInfo => {
    const ref = useRef<HTMLAnchorElement | null>(null);
    const [url, setFileUrl] = useState<string>();
    const [name, setFileName] = useState<string>();

    const download = async () => {
        try {
            console.log("pre-download! " + blob.size);
            let link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "filename");
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }


        } catch (error) {
            console.log(error);
            onError();
        }
    };

    return { download, ref, url, name };
};



