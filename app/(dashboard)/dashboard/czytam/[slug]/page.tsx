import BookView from "@/components/BookView";
import { verifySession } from "@/lib/dal";
export default async function BookComponent({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	await verifySession();
	return <BookView />;
}
