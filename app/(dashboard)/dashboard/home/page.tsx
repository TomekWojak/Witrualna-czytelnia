import { verifySession } from "@/lib/dal";
export default async function DashboardHome() {
	await verifySession();
	return "Strona główna";
}
