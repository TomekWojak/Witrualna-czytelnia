import BookView from "@/components/BookView";
export default async function BookComponent({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	return <BookView />;
}
