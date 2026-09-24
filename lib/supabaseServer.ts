import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function createClient() {
	const cookieStore = await cookies();

	if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
		throw new Error("Brak odpowiedniej ilości danych do utworzenia klienta");
	}

	const supabaseClient = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => cookieStore.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					try {
						cookieStore.set(name, value, options);
					} catch (err) {
						console.log(err);
					}
				});
			},
		},
	});

	return supabaseClient;
}
