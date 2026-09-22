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

	const manifestFile = results.file(opfPath);

	if (!manifestFile) {
		console.log("Plik uszkodzony");
		return;
	}

	const manifestData = await manifestFile.async("text");

	const manifestItems = getManifest(manifestData);
	const spine = getSpine(manifestData);

	const chapterParts = getChapterPaths(spine, manifestItems);

	const chaptersContent = await getChapterContent(
		results,
		opfPath,
		chapterParts,
	);

	return chaptersContent;
};

const getOpfPath = (data: string): string | null | undefined => {
	const domParser = new DOMParser().parseFromString(data, "application/xml");

	const rootFile = domParser.querySelector("rootfile");
	const fullPath = rootFile?.getAttribute("full-path");

	return fullPath;
};

const getManifest = (data: string) => {
	const domParser = new DOMParser().parseFromString(data, "application/xml");
	const mappedItems = new Map<string, string>();

	const items = Array.from(domParser.querySelectorAll("manifest item"));
	items?.forEach((item) => {
		mappedItems.set(
			item.getAttribute("id") ?? "",
			item.getAttribute("href") ?? "",
		);
	});

	return mappedItems;
};

const getSpine = (data: string) => {
	const domParser = new DOMParser().parseFromString(data, "application/xml");
	const spineItems = Array.from(domParser.querySelectorAll("spine itemref"));

	const mappedSpineItems = spineItems?.map(
		(spineItem) => spineItem.getAttribute("idref") ?? "",
	);

	return mappedSpineItems;
};

const getChapterPaths = (
	spine: string[],
	manifestItems: Map<string, string>,
): string[] => {
	const finalArr: string[] = [];

	spine.forEach((item) => {
		const matchingElement = manifestItems.get(item) ?? "";
		finalArr.push(matchingElement);
	});
	return finalArr.filter((el) => el !== "");
};

const getChapterContent = async (
	results: JSZip,
	base: string,
	chapterParts: string[],
) => {
	const promises: Promise<string>[] = [];
	const arr: string[] = base.split("/");
	const prefix: string = arr[0];

	for (const chapter of chapterParts) {
		const path: string = `${prefix}/${chapter}`;
		const chapterData = results.file(path);

		if (!chapterData) {
			console.log("Nieprawidłowa ścieżka pliku lub plik uszkodzony");
			return;
		}

		const rawChapterData = chapterData.async("text");
		promises.push(rawChapterData);
	}
	const data = await Promise.all(promises);

	return data;
};
