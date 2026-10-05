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
		.select("title,author,current_chapter_index,has_been_read,scroll_position")
		.eq("id", slug)
		.single();

	const { error: updateReadTimeError } = await supabaseClient
		.from("books")
		.update({ last_read: "now()" })
		.eq("id", slug);

	if (updateReadTimeError) {
		console.error(updateReadTimeError);
	}

	if (error) {
		return { success: false, message: "Błąd pobierania informacji o książce" };
	}

	const {
		title,
		author,
		current_chapter_index,
		has_been_read,
		scroll_position,
	} = data;

	const { data: chapters, error: chaptersError } = await supabaseClient
		.from("chapters")
		.select("content")
		.order("index")
		.eq("book_id", slug);

	if (chaptersError) {
		return { success: false, message: "Błąd pobierania rozdziałów" };
	}

	const { data: notes, error: notesError } = await supabaseClient
		.from("notes")
		.select("id,chapter_index,paragraph_index,title,description")
		.eq("book_id", slug);

	if (notesError) {
		return { success: false, message: "Błąd pobierania notatek" };
	}

	return {
		success: true,
		title,
		author,
		chapters,
		current_chapter_index,
		has_been_read,
		book_id: slug,
		scroll_position,
		notes,
	};
};
