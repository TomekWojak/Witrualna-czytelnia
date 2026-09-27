import { createClient } from "./supabaseServer";
import { BookInfo } from "./types";

export const getBook = async (
	params: Promise<{
		slug: string;
	}>,
): Promise<BookInfo> => {
	const supabaseClient = await createClient();
	const { slug } = await params;

	const { data, error } = await supabaseClient
		.from("books")
		.select("title,author")
		.eq("id", slug)
		.single();

	if (error) {
		return { success: false, message: "Błąd pobierania autora i tytułu" };
	}

	const { title, author } = data;

	const { data: chapters, error: chaptersError } = await supabaseClient
		.from("chapters")
		.select("content")
		.order("index")
		.eq("book_id", slug);

	if (chaptersError) {
		return { success: false, message: "Błąd pobierania rozdziałów" };
	}

	return { success: true, title, author, chapters };
};
