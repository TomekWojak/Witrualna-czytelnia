"use client";
import type { BookData } from "@/lib/types";
import { UploadInfoContext } from "@/lib/UploadInfoContext";
import { supabaseClient } from "@/lib/supabase";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function MyBooks({
	bookData,
	emptyStateVariant = "reading",
}: {
	bookData: BookData;
	emptyStateVariant?: "reading" | "favorites";
}) {
	const uploadInfoContext = useContext(UploadInfoContext);
	const [books, setBooks] = useState(bookData.success ? bookData.books : []);

	useEffect(() => {
		if (!bookData.success) {
			uploadInfoContext.setUploadingFileInfo(bookData);
			return;
		}
	}, [bookData, uploadInfoContext]);

	const handleAddToFavorites = async (id: string) => {
		const { error } = await supabaseClient
			.from("books")
			.update({ is_favorite: true })
			.eq("id", id);

		if (error) {
			console.error(error);
			return;
		}

		setBooks((prev) =>
			prev.map((book) =>
				book.id === id ? { ...book, is_favorite: true } : book,
			),
		);

		uploadInfoContext.setUploadingFileInfo({
			success: true,
			message: "Pomyślnie dodano do ulubionych",
			id,
		});
	};

	const handleRemoveFromFavorites = async (id: string) => {
		const { error } = await supabaseClient
			.from("books")
			.update({ is_favorite: false })
			.eq("id", id);

		if (error) {
			console.error(error);
			return;
		}

		setBooks((prev) =>
			prev.map((book) =>
				book.id === id ? { ...book, is_favorite: false } : book,
			),
		);

		uploadInfoContext.setUploadingFileInfo({
			success: true,
			message: "Pomyślnie usunięto z ulubionych",
			id,
		});
	};

	const handleRemoveFromReading = async (id: string) => {
		const { error } = await supabaseClient.from("books").delete().eq("id", id);

		if (error) {
			console.error(error);
			uploadInfoContext.setUploadingFileInfo({
				success: false,
				message: "Wystąpił problem z usuwaniem pozycji z listy",
			});
			return;
		}

		uploadInfoContext.setUploadingFileInfo({
			success: true,
			message: "Pomyślnie usunięto pozycję z listy",
		});

		setBooks((prev) => prev.filter((book) => book.id !== id));
	};

	if (!bookData.success) return;

	if (books.length === 0) {
		if (emptyStateVariant === "favorites") {
			return (
				<div className="flex flex-col items-center text-center gap-3 py-20 px-4 w-full text-mainTxt rounded-2xl font-lora">
					<div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
						</svg>
					</div>
					<h2 className="text-xl font-semibold">
						Nie masz jeszcze ulubionych książek
					</h2>
					<p className="max-w-sm text-sm text-mainTxt/60">
						Oznacz książkę jako ulubioną z poziomu menu opcji, żeby szybko do
						niej wracać.
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
						„Zawsze wyobrażałem sobie Raj jako rodzaj biblioteki.”
					</blockquote>
					<span className="text-sm text-mainTxt/50">- Jorge Luis Borges</span>
				</div>
			);
		}

		return (
			<div className="flex flex-col items-center text-center gap-3 py-20 px-4 w-full text-mainTxt rounded-2xl">
				<div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
						<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
					</svg>
				</div>
				<h2 className="text-xl font-semibold">Twoja biblioteka jest pusta</h2>
				<p className="max-w-sm text-sm text-mainTxt/60">
					Zaimportuj swój pierwszy ebook, żeby zacząć czytać - kliknij{" "}
					<strong className="text-accent">Importuj</strong> w prawym górnym
					rogu.
				</p>
			</div>
		);
	}

	return (
		<ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
			{books.map(
				({
					title,
					id,
					author,
					cover_url,
					current_chapter_index,
					chapter_count,
					is_favorite,
				}) => {
					const progress =
						chapter_count > 0
							? Math.round(((current_chapter_index + 1) / chapter_count) * 100)
							: 0;

					return (
						<li key={id} className="relative">
							<Link
								aria-label={`Link do książki ${title}`}
								href={`/dashboard/czytam/${id}`}
								className="group flex flex-col gap-2">
								<div className="relative aspect-2/3 w-full overflow-hidden rounded-lg border-2 border-accent/20 bg-accent/10 shadow-sm group-hover:border-accent">
									{cover_url ? (
										<Image
											src={cover_url}
											fill
											sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
											alt={`Okładka książki ${title}`}
											className="object-cover group-hover:scale-105 transition-transform duration-300"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center text-accent/40">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="40"
												height="40"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round">
												<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
												<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
											</svg>
										</div>
									)}
								</div>
								<div>
									<p className="text-sm font-medium text-mainTxt truncate">
										{title}
									</p>
									<p className="text-xs text-mainTxt/60 truncate">{author}</p>
									<div className="mt-2 flex items-center gap-2">
										<div className="h-1 flex-1 overflow-hidden rounded-full bg-accent/15">
											<div
												className="h-full rounded-full bg-linear-to-r from-accent to-accentSecondary"
												style={{ width: `${progress}%` }}
											/>
										</div>
										<span className="text-[0.65rem] font-medium tabular-nums text-mainTxt/50 shrink-0">
											{progress}%
										</span>
									</div>
								</div>
							</Link>
							<div className="controls mt-3 flex items-center justify-center gap-2">
								<button className="flex items-center gap-2 px-3 py-2 text-sm text-left text-mainTxt cursor-pointer transition-colors hover:bg-accent/10 rounded-lg">
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
										className="feather feather-check-circle w-4.5">
										<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
										<polyline points="22 4 12 14.01 9 11.01"></polyline>
									</svg>
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										if (is_favorite) {
											handleRemoveFromFavorites(id);
										} else {
											handleAddToFavorites(id);
										}
									}}
									className="flex items-center gap-2 px-3 py-2 text-sm text-left text-mainTxt cursor-pointer transition-colors hover:bg-accent/10 rounded-lg">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill={is_favorite ? "currentColor" : "none"}
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="feather feather-heart w-4.5">
										<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
									</svg>
								</button>

								<button
									onClick={(e) => {
										e.stopPropagation();
										handleRemoveFromReading(id);
									}}
									className="flex items-center gap-2 px-3 py-2 text-sm text-left text-red-500 cursor-pointer transition-colors hover:bg-red-500/10 rounded-lg">
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
										className="feather feather-trash-2 w-4.5">
										<polyline points="3 6 5 6 21 6"></polyline>
										<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
										<line x1="10" y1="11" x2="10" y2="17"></line>
										<line x1="14" y1="11" x2="14" y2="17"></line>
									</svg>
								</button>
							</div>
						</li>
					);
				},
			)}
		</ul>
	);
}
