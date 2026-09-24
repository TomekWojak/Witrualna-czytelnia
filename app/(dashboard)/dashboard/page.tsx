import { verifySession } from "@/lib/dal";
export default async function Home() {
	await verifySession();
	return "";
}
