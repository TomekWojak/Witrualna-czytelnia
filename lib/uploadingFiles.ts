import JSZip from "jszip";

export const handleImportedFile = async (
	e: React.ChangeEvent<HTMLInputElement>,
) => {
	const file = e.target.files?.[0];

	if (!file) return;

	const name = file.name.toLowerCase();
	e.target.value = "";

	if (!name.endsWith(".epub") && !name.endsWith(".pdf")) {
		console.log("Nieprawidłowy format");
		return;
	}

	const buffer = await file.arrayBuffer();

	if (name.endsWith(".epub")) {
		const results = (await readEpub(buffer)) ?? "";
		console.log(results);
	}
};

const readEpub = async (buffer: ArrayBuffer) => {
	const results = await JSZip.loadAsync(buffer);
	const path = results.file("META-INF/container.xml");

	if (!path) {
		console.log("Plik jest prawdopodobnie uszkodzony");
		return;
	}

	const data = await path.async("text");
	const opfPath = getOpfPath(data) ?? "";

	return opfPath;
};

const getOpfPath = (data: string): string | null | undefined => {
	const domParser = new DOMParser().parseFromString(data, "application/xml");

	const rootFile = domParser.querySelector("rootfile");
	const fullPath = rootFile?.getAttribute("full-path");

	return fullPath;
};
