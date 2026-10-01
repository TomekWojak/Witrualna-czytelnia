import { verifySession } from "@/lib/dal";
import { createClient } from "@/lib/supabaseServer";
import type { BookData } from "./types";

export const getBooks = async (options?: {
	favoritesOnly?: boolean;
	readOnly?: boolean;
	excludeRead?: boolean;
	sortedByDate?: boolean;
	lastAddedBooks?: boolean;
}): Promise<BookData> => {
	const { id } = await verifySession();

	if (!id) return { success: false, message: "Nieprawidłowa sesja" };

	const supabaseClient = await createClient();

	let query = supabaseClient
		.from("books")
		.select(
			"id,title,author,cover_url,current_chapter_index,chapter_count,is_favorite,has_been_read,created_at",
		)
		.eq("user_id", id);

	if (options?.sortedByDate) {
		query = query
			.order("last_read", { ascending: false, nullsFirst: false })
			.limit(1);
	} else if (options?.lastAddedBooks) {
		query = query.order("created_at", { ascending: false }).limit(4);
	} else {
		query = query.order("created_at");
	}

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

export const getBookCounts = async (): Promise<
	{ success: true; read: number; favorites: number } | { success: false; message: string }
> => {
	const { id } = await verifySession();

	if (!id) return { success: false, message: "Nieprawidłowa sesja" };

	const supabaseClient = await createClient();

	const [readResult, favoritesResult] = await Promise.all([
		supabaseClient
			.from("books")
			.select("id", { count: "exact", head: true })
			.eq("user_id", id)
			.eq("has_been_read", true),
		supabaseClient
			.from("books")
			.select("id", { count: "exact", head: true })
			.eq("user_id", id)
			.eq("is_favorite", true),
	]);

	if (readResult.error || favoritesResult.error)
		return {
			success: false,
			message: "Błąd podczas pobierania statystyk",
		};

	return {
		success: true,
		read: readResult.count ?? 0,
		favorites: favoritesResult.count ?? 0,
	};
};
