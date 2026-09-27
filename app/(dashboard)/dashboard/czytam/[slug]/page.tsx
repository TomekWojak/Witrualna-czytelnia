import BookView from "@/components/BookView";
import { verifySession } from "@/lib/dal";
import { getBook } from "@/lib/getBook";

export default async function BookComponent({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	await verifySession();
	const response = await getBook(params);

	return <BookView response={response} />;
}
