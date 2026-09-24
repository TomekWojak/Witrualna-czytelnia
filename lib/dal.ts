import { redirect } from "next/navigation";
import { createClient } from "./supabaseServer";
export async function verifySession() {
	const supabaseClient = await createClient();
	const response = await supabaseClient.auth.getUser();
	const {
		data: { user },
	} = response;

	if (!user) {
		redirect("/logowanie");
	}

	return user;
}
