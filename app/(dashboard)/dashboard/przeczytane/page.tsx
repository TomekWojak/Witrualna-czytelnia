import { verifySession } from "@/lib/dal";
import { getBooks } from "@/lib/getBooks";
import MyBooks from "@/components/MyBooks";

export default async function ReadBooks() {
	await verifySession();

	const bookData = await getBooks({ readOnly: true });

	return <MyBooks bookData={bookData} emptyStateVariant="read" />;
}
