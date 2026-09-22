import { createContext } from "react";
import type { ContextProps } from "./types";
export const HeaderTitleContext = createContext<ContextProps>({
	title: undefined,
	setTitle: () => {},
});
