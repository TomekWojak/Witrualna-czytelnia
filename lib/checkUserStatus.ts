import { createClient } from "./supabaseServer";
import { verifySession } from "./dal";
import type { UserStatusResult } from "./types";

export const checkUserStatus = async (): Promise<UserStatusResult> => {
	const { id } = await verifySession();

	const supabaseClient = await createClient();

	const { data, error } = await supabaseClient
		.from("profiles")
		.select("plan")
		.eq("id", id)
		.single();

	if (error) {
		console.error(error);
		return {
			success: false,
			message: "Błąd podczas pobierania planu subskrybcji",
		};
	}

	return { success: true, plan: data.plan };
};
