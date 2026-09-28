import { verifySession } from "@/lib/dal";
import { createClient } from "@/lib/supabaseServer";
import type { BookData } from "./types";

export const getCurrentReadingBooks = async (): Promise<BookData> => {
	const { id } = await verifySession();

	if (!id) return { success: false, message: "Nieprawidłowa sesja" };

	const supabaseClient = await createClient();

	const { data, error } = await supabaseClient
		.from("books")
		.select("id,title,author,cover_url,current_chapter_index,chapter_count")
		.eq("user_id", id)
		.order("created_at");

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
