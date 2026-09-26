export type frameProps = {
	asideOpen: boolean;
	onAsideOpenAction: React.Dispatch<React.SetStateAction<boolean>>;
	onDesktopAsideOpen: React.Dispatch<React.SetStateAction<boolean>>;
	inputRefs: React.RefObject<HTMLInputElement | null>;
	onDropboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export type HeaderContextProps = {
	title: string | undefined;
	setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
};
export type UserData = {
	name: string | null;
	avatar_url: string | null;
	plan: string;
	bio: string | null;
};

export type UserContextProps = {
	userData: UserData | null;
	setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
};
