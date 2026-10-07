import { verifySession } from "@/lib/dal";
import { getNotes } from "@/lib/getNotes";
import NotesView from "@/components/NotesView";
export default async function Notes() {
	await verifySession();

	const notes = await getNotes();

	return <NotesView notes={notes} />;
}
