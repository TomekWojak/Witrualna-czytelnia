import { createContext } from "react";
import { UploadInfoContextProps } from "./types";
export const UploadInfoContext = createContext<UploadInfoContextProps>({
	setUploadingFileInfo: () => {},
});
