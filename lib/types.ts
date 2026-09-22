export type frameProps = {
	asideOpen: boolean;
	onAsideOpenAction: React.Dispatch<React.SetStateAction<boolean>>;
	inputRefs: React.RefObject<HTMLInputElement | null>;
	onDropboxOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export type ContextProps = {
	title: string | undefined;
	setTitle: React.Dispatch<React.SetStateAction<string | undefined>>;
};
