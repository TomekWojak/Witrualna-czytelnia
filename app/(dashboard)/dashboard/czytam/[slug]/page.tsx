import BookView from "@/components/BookView";
import { verifySession } from "@/lib/dal";
import { getBook } from "@/lib/getBook";

export default async function BookComponent({
	params,
	searchParams,
}: {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	await verifySession();
	const response = await getBook(params);
	const { note } = await searchParams;

	if (typeof note !== "string" && typeof note !== "undefined") return;

	return <BookView targetNodeId={note} response={response} />;
}
