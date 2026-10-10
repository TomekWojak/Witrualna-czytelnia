"use server";
import { createClient } from "@/lib/supabaseServer";
import type { ModelChapterResults } from "./types";

export const getChapterToAnalysis = async (
	bookId: string,
	chapterIndex: number,
): Promise<ModelChapterResults> => {
	const supabaseClient = await createClient();

	const { data, error } = await supabaseClient
		.from("chapters")
		.select("content")
		.eq("book_id", bookId)
		.eq("index", chapterIndex)
		.single();

	if (error) {
		console.error(error);
		return { success: false, message: "Błąd pobierania danych o rozdziale" };
	}

	return { success: true, content: data.content };
};
