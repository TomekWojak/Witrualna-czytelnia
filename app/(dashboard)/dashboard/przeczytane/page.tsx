import { verifySession } from "@/lib/dal";
export default async function ReadBooks() {
	await verifySession()
	return "test";
}
