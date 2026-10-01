import { verifySession } from "@/lib/dal";
import DashboardMain from "@/components/DashboardMain";
import { getBooks, getBookCounts } from "@/lib/getBooks";

export default async function DashboardHome() {
	await verifySession();

	const lastReadBook = await getBooks({ sortedByDate: true });
	const lastAddedBooks = await getBooks({ lastAddedBooks: true });
	const bookCounts = await getBookCounts();

	return (
		<DashboardMain
			lastReadBook={lastReadBook}
			lastAddedBooks={lastAddedBooks}
			bookCounts={bookCounts}
		/>
	);
}
