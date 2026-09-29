import { getBooks } from "@/lib/getBooks";
import MyBooks from "@/components/MyBooks";

export default async function Favorites() {
	const bookData = await getBooks({ favoritesOnly: true });

	return <MyBooks bookData={bookData} emptyStateVariant="favorites" />;
}
