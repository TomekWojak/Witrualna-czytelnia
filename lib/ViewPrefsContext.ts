import { createContext } from "react";
import type { ViewPrefsContextProps } from "./types";

export const ViewPrefsContext = createContext<ViewPrefsContextProps>({
	setViewPrefs: () => {},
	viewPrefs: {
		isDesktopAsideOpen: true,
		isHeaderVisible: true,
		isReaderPanelVisible: true,
	},
});
