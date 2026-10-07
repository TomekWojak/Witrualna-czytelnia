"use client";
import { useContext, useMemo, useState } from "react";
import Link from "next/link";
import type { NoteWithBook } from "@/lib/types";
import { supabaseClient } from "@/lib/supabase";
import { UploadInfoContext } from "@/lib/UploadInfoContext";

type BookGroup = {
	bookId: string;
	title: string;
	author: string;
	notes: NoteWithBook[];
};

const groupByBook = (notes: NoteWithBook[]): BookGroup[] => {
	const groups = new Map<string, BookGroup>();

	notes.forEach((note) => {
		const bookId = note.book_id ?? "";
		const group = groups.get(bookId);

		if (group) {
			group.notes.push(note);
			return;
		}

		groups.set(bookId, {
			bookId,
			title: note.books?.title ?? "Nieznana książka",
			author: note.books?.author ?? "",
			notes: [note],
		});
	});

	return Array.from(groups.values());
};

const NoteIcon = ({ size = 18 }: { size?: number }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round">
		<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
	</svg>
);

export default function NotesView({
	notes: initialNotes,
}: {
	notes: NoteWithBook[] | undefined;
}) {
	const [notes, setNotes] = useState(initialNotes ?? []);
	const [query, setQuery] = useState("");
	const uploadInfoContext = useContext(UploadInfoContext);

	const deleteNote = async (id: string) => {
		const { error } = await supabaseClient.from("notes").delete().eq("id", id);

		if (error) {
			console.error(error);
			uploadInfoContext.setUploadingFileInfo({
				success: false,
				message: "Błąd usuwania notatki",
			});
			return;
		}

		uploadInfoContext.setUploadingFileInfo({
			success: true,
			message: "Pomyślnie usunięto notatkę",
		});

		setNotes((prev) => prev.filter((note) => note.id !== id));
	};

	const groups = useMemo(() => {
		const phrase = query.trim().toLowerCase();

		const filtered = phrase
			? notes.filter((note) =>
					[note.title, note.description, note.books?.title ?? ""].some((text) =>
						text.toLowerCase().includes(phrase),
					),
				)
			: notes;

		return groupByBook(filtered);
	}, [notes, query]);

	if (!initialNotes) {
		return (
			<div className="flex flex-col items-center text-center gap-2 py-20 px-4 text-mainTxt font-lora">
				<h2 className="text-xl font-semibold">Nie udało się pobrać notatek</h2>
				<p className="max-w-sm text-sm text-mainTxt/60">
					Spróbuj odświeżyć stronę za chwilę.
				</p>
			</div>
		);
	}

	if (notes.length === 0) {
		return (
			<div className="flex flex-col items-center text-center gap-3 py-20 px-4 w-full text-mainTxt font-lora">
				<div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent">
					<NoteIcon size={28} />
				</div>
				<h2 className="text-xl font-semibold">Nie masz jeszcze notatek</h2>
				<p className="max-w-sm text-sm text-mainTxt/60">
					Podczas czytania włącz tryb notatek w dolnym panelu i kliknij akapit,
					przy którym chcesz coś zapisać.
				</p>
				<div className="flex items-center gap-4 w-full max-w-sm pt-4">
					<span className="h-px flex-1 bg-accent/20" />
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-accent/60 shrink-0">
						<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
						<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
					</svg>
					<span className="h-px flex-1 bg-accent/20" />
				</div>
				<blockquote className="italic text-mainTxt/70">
					„Czytanie czyni człowieka pełnym, rozmowa - gotowym, a pisanie -
					dokładnym.”
				</blockquote>
				<span className="text-sm text-mainTxt/50">- Francis Bacon</span>
			</div>
		);
	}

	return (
		<div className="container mx-auto space-y-8 text-mainTxt font-lora">
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
				<div>
					<h1 className="font-playfairDisplay text-3xl sm:text-4xl">
						Twoje notatki
					</h1>
					<div className="mt-3 h-1 w-16 bg-accent rounded-full" />
				</div>

				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Szukaj w notatkach…"
					className="w-full sm:w-72 border border-accent/30 rounded-full bg-panel/60 px-4 py-2 text-sm outline-0 focus:border-accent transition-colors"
				/>
			</div>

			{groups.length === 0 && (
				<p className="text-center text-mainTxt/60 py-10">
					Żadna notatka nie pasuje do „{query.trim()}”.
				</p>
			)}

			{groups.map((group) => (
				<section
					key={group.bookId}
					className="bg-panel/60 border border-accent/20 rounded-2xl p-5 sm:p-6">
					<div className="flex flex-col sm:flex-row sm:items-center gap-3 pb-4 mb-5 border-b border-accent/20">
						<div className="min-w-0">
							<h2 className="font-playfairDisplay text-xl sm:text-2xl truncate">
								{group.title}
							</h2>
							{group.author && (
								<p className="text-sm text-mainTxt/60">{group.author}</p>
							)}
						</div>
						<span className="sm:ml-auto inline-flex items-center gap-1.5 self-start sm:self-center px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium shrink-0">
							<NoteIcon size={12} />
							{group.notes.length}
						</span>
						{group.bookId && (
							<Link
								href={`/dashboard/czytam/${group.bookId}`}
								className="inline-flex items-center gap-1.5 self-start sm:self-center text-sm font-montserrat text-accent hover:underline shrink-0">
								Otwórz książkę
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round">
									<line x1="5" y1="12" x2="19" y2="12"></line>
									<polyline points="12 5 19 12 12 19"></polyline>
								</svg>
							</Link>
						)}
					</div>

					<ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{group.notes.map((note) => (
							<li key={note.id} className="relative w-full h-full">
								<Link
									className="w-full h-full flex flex-col gap-2 bg-main rounded-xl p-4 border border-accent/10"
									href={`/dashboard/czytam/${note.book_id}?note=${note.id}`}>
									<span className="self-start px-2 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium">
										Rozdział {note.chapter_index + 1}
									</span>

									<h3
										className={`font-playfairDisplay text-lg leading-snug ${note.title ? "" : "italic text-mainTxt/50"}`}>
										{note.title || "Bez tytułu"}
									</h3>
									{note.description && (
										<p className="text-sm text-mainTxt/70 leading-relaxed whitespace-pre-line line-clamp-5">
											{note.description}
										</p>
									)}
								</Link>

								<button
									onClick={(e) => {
										e.stopPropagation();
										deleteNote(note.id);
									}}
									className="absolute right-2 top-2 flex items-center gap-2 px-3 py-2 text-sm text-left text-red-500 cursor-pointer transition-colors hover:bg-red-500/10 rounded-lg">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="feather feather-trash-2 w-4">
										<polyline points="3 6 5 6 21 6"></polyline>
										<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
										<line x1="10" y1="11" x2="10" y2="17"></line>
										<line x1="14" y1="11" x2="14" y2="17"></line>
									</svg>
								</button>
							</li>
						))}
					</ul>
				</section>
			))}
		</div>
	);
}
