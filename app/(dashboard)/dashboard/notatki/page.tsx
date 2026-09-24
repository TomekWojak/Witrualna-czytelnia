import { verifySession } from "@/lib/dal";
export default async function Notes() {
	await verifySession()
	return "Notatki";
}
