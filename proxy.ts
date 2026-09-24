import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function proxy(request: NextRequest) {
	let response = NextResponse.next({ request });

	if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
		throw new Error("Brak odpowiedniej ilości danych do utworzenia klienta");
	}

	const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => request.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value }) =>
					request.cookies.set(name, value),
				);
				response = NextResponse.next({ request });
				cookiesToSet.forEach(({ name, value, options }) =>
					response.cookies.set(name, value, options),
				);
			},
		},
	});

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
		return NextResponse.redirect(new URL("/logowanie", request.url));
	}

	return response;
}
export const config = {
	matcher: ["/dashboard/:path*"],
};
