import { createContext } from "react";
import { UserContextProps } from "./types";
export const UserProfileContext = createContext<UserContextProps>({
	userData: null,
	setUserData: () => {},
});
