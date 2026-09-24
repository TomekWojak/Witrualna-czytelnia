import { verifySession } from "@/lib/dal";
export default async function Books() {
	await verifySession()
	return "Książki";
}
