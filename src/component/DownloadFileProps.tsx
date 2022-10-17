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

export const useDownloadFile = ({
    preDownloading,
    postDownloading,
    onError,
    getFileName,
}: DownloadFileProps, file: Blob): DownloadedFileInfo => {
    const ref = useRef<HTMLAnchorElement | null>(null);
    const [url, setFileUrl] = useState<string>();
    const [name, setFileName] = useState<string>();

    const download = async () => {
        try {
            console.log("pre-download! " + file.size);

            preDownloading();
            const url = URL.createObjectURL(file);
            console.log(url);

            setFileUrl(url);
            setFileName(getFileName());
            ref.current?.click();
            postDownloading();
            URL.revokeObjectURL(url);
        } catch (error) {
            onError();
        }
    };

    return { download, ref, url, name };
};