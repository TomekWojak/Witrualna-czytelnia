import { getBooks } from "@/lib/getBooks";
import MyBooks from "@/components/MyBooks";

export default async function CurrentlyReading() {
	const bookData = await getBooks({ excludeRead: true });

	return <MyBooks bookData={bookData} />;
}
