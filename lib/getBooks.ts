import { verifySession } from "@/lib/dal";
import { createClient } from "@/lib/supabaseServer";
import type { BookData } from "./types";

export const getBooks = async (options?: {
	favoritesOnly?: boolean;
}): Promise<BookData> => {
	const { id } = await verifySession();

	if (!id) return { success: false, message: "Nieprawidłowa sesja" };

	const supabaseClient = await createClient();

	let query = supabaseClient
		.from("books")
		.select(
			"id,title,author,cover_url,current_chapter_index,chapter_count,is_favorite",
		)
		.eq("user_id", id)
		.order("created_at");

	if (options?.favoritesOnly) {
		query = query.eq("is_favorite", true);
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
