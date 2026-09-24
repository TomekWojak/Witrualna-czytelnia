import { verifySession } from "@/lib/dal";

export default async function CurrentlyReading() {
	await verifySession()
	return "Czytam";
}
