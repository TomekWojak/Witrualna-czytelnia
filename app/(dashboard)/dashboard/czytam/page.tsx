import { getCurrentReadingBooks } from "@/lib/getCurrentReadingBooks";
import MyBooks from "@/components/MyBooks";

export default async function CurrentlyReading() {
	const bookData = await getCurrentReadingBooks();

	return <MyBooks bookData={bookData} />;
}
