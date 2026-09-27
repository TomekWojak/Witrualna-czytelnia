export type frameProps = {
	asideOpen: boolean;
	onAsideOpenAction: React.Dispatch<React.SetStateAction<boolean>>;
	onDesktopAsideOpen: React.Dispatch<React.SetStateAction<boolean>>;
	inputRefs: React.RefObject<HTMLInputElement | null>;
	onDropboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsFileLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setUploadingFileInfo: React.Dispatch<
		React.SetStateAction<ImportResult | null>
	>;
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

export type ImportResult = { success: boolean; message: string };

export type UserContextProps = {
	userData: UserData | null;
	setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
};
