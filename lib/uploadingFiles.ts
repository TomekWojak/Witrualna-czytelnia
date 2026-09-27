import JSZip from "jszip";
import { supabaseClient } from "./supabase";
import type { ImportResult } from "./types";
type ReadEpubResults =
	| { success: true; chaptersContent: string[] | undefined; id: string }
	| { success: false; error: string; code?: string };

export const handleImportedFile = async (
	e: React.ChangeEvent<HTMLInputElement>,
): Promise<ImportResult> => {
	const file = e.target.files?.[0];

	if (!file) return { success: false, message: "Błąd wgrywania pliku" };

	const name = file.name.toLowerCase();
	e.target.value = "";

	if (!name.endsWith(".epub") && !name.endsWith(".pdf")) {
		return { success: false, message: "Nieprawidłowy format pliku!" };
	}

	const buffer = await file.arrayBuffer();

	const hash = await hashFile(buffer);

	if (name.endsWith(".epub")) {
		const results = (await readEpub(buffer, file, hash)) ?? "";

		if (!results || results.success === false) {
			if (results && results.code === "23505") {
				return { success: false, message: "Książka już istnieje w bazie" };
			}
			return { success: false, message: "Błąd podczas wczytywania ebooka" };
		}

		if (!results.chaptersContent || !results.id) {
			return { success: false, message: "Błąd podczas wczytywania ebooka" };
		}

		setChaptersToDatabase(results.chaptersContent, results.id);

		return {
			success: true,
			message: "Pomyślnie załadowano ebooka!",
			id: results.id,
		};
	}
	return { success: false, message: "Wystąpił nieoczekiwany problem" };
};

const readEpub = async (
	buffer: ArrayBuffer,
	book: File,
	hash: string,
): Promise<ReadEpubResults> => {
	const results = await JSZip.loadAsync(buffer);
	const path = results.file("META-INF/container.xml");

	if (!path) {
		console.log("Plik jest prawdopodobnie uszkodzony");
		return { success: false, error: "Plik jest uszkodzony" };
	}

	const data = await path.async("text");
	const opfPath = getOpfPath(data) ?? "";

	const manifestFile = results.file(opfPath);

	if (!manifestFile) {
		console.log("Plik uszkodzony");
		return { success: false, error: "Plik jest uszkodzony" };
	}

	const manifestData = await manifestFile.async("text");

	const {
		data: { user },
	} = await supabaseClient.auth.getUser();

	if (!user) {
		throw new Error("Wystąpił problem z identyfikacją użytkownika");
	}
	const { title, author } = getMetadata(manifestData);

	const manifestItems = getManifest(manifestData);
	const spine = getSpine(manifestData);

	const chapterParts = getChapterPaths(spine, manifestItems);

	const chaptersContent = await getChapterContent(
		results,
		opfPath,
		chapterParts,
	);

	const bookPath = `${user.id}/${book.name}`;

	const { error: uploadError } = await supabaseClient.storage
		.from("books")
		.upload(bookPath, book, { upsert: true });

	if (uploadError) {
		console.error(uploadError);
		return { success: false, error: "Błąd w pobieraniu danych o książce" };
	}
	const {
		data: { publicUrl },
	} = supabaseClient.storage.from("books").getPublicUrl(bookPath);

	const bookUrl = `${publicUrl}?t=${Date.now()}`;

	const bookIdStatus = await supabaseClient
		.from("books")
		.insert({
			title,
			author,
			user_id: user.id,
			epub_path: bookUrl,
			file_hash: hash,
		})
		.select("id");

	if (bookIdStatus.error) {
		if (bookIdStatus.error?.code === "23505") {
			return {
				success: false,
				error: "c",
				code: bookIdStatus.error.code,
			};
		}

		return {
			success: false,
			error: "Wystąpił błąd podczas zapisywania książki",
		};
	}

	const id = bookIdStatus.data && bookIdStatus.data[0].id;

	if (!id)
		return {
			success: false,
			error: "Wystąpił błąd podczas zapisywania książki",
		};

	return { success: true, chaptersContent, id };
};

const setChaptersToDatabase = async (chapters: string[], book_id: string) => {
	let index = 0;
	for (const chapter of chapters) {
		const { error: uploadError } = await supabaseClient
			.from("chapters")
			.insert({ book_id, index, content: chapter });

		if (uploadError) {
			console.error(uploadError);

			return {
				success: false,
				error: "Wystąpił błąd podczas zapisywania książki",
			};
		}
		index++;
	}
};

const getOpfPath = (data: string): string | null | undefined => {
	const domParser = new DOMParser().parseFromString(data, "application/xml");

	const rootFile = domParser.querySelector("rootfile");
	const fullPath = rootFile?.getAttribute("full-path");

	return fullPath;
};

const getMetadata = (data: string) => {
	const domParser = new DOMParser().parseFromString(data, "application/xml");
	const title = domParser.getElementsByTagName("dc:title")[0]?.textContent;
	const author = domParser.getElementsByTagName("dc:creator")[0]?.textContent;

	return { title, author };
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
			console.error("Nieprawidłowa ścieżka pliku lub plik uszkodzony");

			return;
		}

		const rawChapterData = chapterData.async("text");
		promises.push(rawChapterData);
	}
	const data = await Promise.all(promises);

	return data;
};

const hashFile = async (buffer: ArrayBuffer): Promise<string> => {
	const fingerPrint = await crypto.subtle.digest("SHA-256", buffer);
	const uint8Array = new Uint8Array(fingerPrint);

	const encodedBytes = Array.from(uint8Array).map((byte) => {
		return byte.toString(16).padStart(2, "0");
	});

	return encodedBytes.join("");
};
