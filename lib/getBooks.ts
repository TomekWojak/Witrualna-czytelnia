import { verifySession } from "@/lib/dal";
import { createClient } from "@/lib/supabaseServer";
import type { BookData } from "./types";

export const getBooks = async (options?: {
	favoritesOnly?: boolean;
	readOnly?: boolean;
	excludeRead?: boolean;
}): Promise<BookData> => {
	const { id } = await verifySession();

	if (!id) return { success: false, message: "Nieprawidłowa sesja" };

	const supabaseClient = await createClient();

	let query = supabaseClient
		.from("books")
		.select(
			"id,title,author,cover_url,current_chapter_index,chapter_count,is_favorite,has_been_read",
		)
		.eq("user_id", id)
		.order("created_at");

	if (options?.favoritesOnly) {
		query = query.eq("is_favorite", true);
	}
	if (options?.readOnly) {
		query = query.eq("has_been_read", true);
	}
	if (options?.excludeRead) {
		query = query.eq("has_been_read", false);
	}

	const { data, error } = await query;

	if (error)
		return {
			success: false,
			message: "Błąd podczas pobierania danych o książkach",
		};

	return {
		success: true,
		books: data,
	};
};
