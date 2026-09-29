export type frameProps = {
	asideOpen: boolean;
	onAsideOpenAction: React.Dispatch<React.SetStateAction<boolean>>;
	onDesktopAsideOpen: React.Dispatch<React.SetStateAction<boolean>>;
	inputRefs: React.RefObject<HTMLInputElement | null>;
	onDropboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleFileUpload: (file: File | undefined) => Promise<void>;
};
export type HeaderContextProps = {
	title: string | undefined;
	setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
	author: string | undefined;
	setAuthor: React.Dispatch<React.SetStateAction<string | undefined>>;
};
export type UserData = {
	name: string | null;
	avatar_url: string | null;
	plan: string;
	bio: string | null;
};

export type ImportResult =
	| { success: true; message: string; id?: string }
	| { success: false; message: string };

export type UserContextProps = {
	userData: UserData | null;
	setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
};
export type UploadInfoContextProps = {
	setUploadingFileInfo: React.Dispatch<
		React.SetStateAction<ImportResult | null>
	>;
};
export type BookInfo =
	| {
			success: true;
			title: string;
			author: string;
			chapters: {
				content: string;
			}[];
			book_id: string;
			current_chapter_index: number;
	  }
	| { success: false; message: string };

export type BookData =
	| {
			success: true;
			books: {
				id: string;
				cover_url: string | null;
				title: string;
				author: string;
				current_chapter_index: number;
				chapter_count: number;
				is_favorite: boolean;
			}[];
	  }
	| { success: false; message: string };
