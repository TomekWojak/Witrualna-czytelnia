import { createContext } from "react";
import type { HeaderContextProps } from "./types";
export const HeaderTitleContext = createContext<HeaderContextProps>({
	title: undefined,
	setTitle: () => {},
});
