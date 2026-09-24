import { verifySession } from "@/lib/dal";
export default async function Settings() {
	await verifySession();
	
	return ('')
}
