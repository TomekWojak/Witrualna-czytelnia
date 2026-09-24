import { verifySession } from "@/lib/dal";
export default async function Favorites() {
	await verifySession()
	return "Ulubione";
}
