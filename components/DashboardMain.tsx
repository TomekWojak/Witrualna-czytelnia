"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserProfileContext } from "@/lib/UserProfileContext";
import type { BookCounts, BookData } from "@/lib/types";

export default function DashboardMain({
	lastReadBook,
	lastAddedBooks,
	bookCounts,
}: {
	lastReadBook: BookData;
	lastAddedBooks: BookData;
	bookCounts: BookCounts;
}) {
	const { userData } = useContext(UserProfileContext);
	const [book, setBook] = useState(
		lastReadBook.success ? lastReadBook.books[0] : undefined,
	);
	const [books, setBooks] = useState(
		lastAddedBooks.success ? lastAddedBooks.books : [],
	);
	const readCount = bookCounts.success ? bookCounts.read : 0;
	const favoritesCount = bookCounts.success ? bookCounts.favorites : 0;

	return (
		<div className="space-y-6 container mx-auto">
			<div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
				<div>
					<h1 className="font-playfairDisplay text-3xl sm:text-4xl text-mainTxt">
						Witaj ponownie,{" "}
						<span className="italic text-accent">{userData?.name}</span>
					</h1>
					<div className="mt-3 h-1 w-16 bg-accent rounded-full" />
					<p className="mt-4 text-mainTxt/60">
						Dobrze, że znów tu jesteś. Czas na kolejną dobrą historię.
					</p>
				</div>

				<svg
					aria-hidden
					xmlns="http://www.w3.org/2000/svg"
					width="64"
					height="64"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="hidden sm:block absolute -top-2 right-0 text-accent/15 -z-10">
					<path d="M12 22c0-7-5-10-9-11 4-3 9-1 9 4" />
					<path d="M12 22c0-7 5-10 9-11-4-3-9-1-9 4" />
					<path d="M12 11v11" />
				</svg>

				<div className="text-left max-w-xs font-lora shrink-0">
					<p className="italic text-mainTxt/70 text-md leading-relaxed">
						„Książki są lustrami: widzisz w nich tylko to, co już masz w sobie.”
					</p>
					<span className="text-xs text-mainTxt/50">- Carlos Ruiz Zafón</span>
				</div>
			</div>

			{book ? (
				<div className="bg-panel/60 border border-accent/20 rounded-2xl p-5 sm:p-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:pr-20">
					<div className="flex flex-col sm:flex-row gap-8 items-center xl:w-full">
						{book.cover_url ? (
							<Image
								width={50}
								height={100}
								alt=""
								src={book.cover_url}
								className="w-1/3 max-w-30 mx-auto aspect-2/3 rounded-md"
							/>
						) : (
							<div className="relative w-28 aspect-2/3 shrink-0 overflow-hidden rounded-lg border-2 border-accent/20 bg-accent/10 mx-auto sm:mx-0">
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
							</div>
						)}
						<div className="flex flex-col flex-1 text-center sm:text-left">
							<span className="inline-flex items-center justify-center sm:justify-start gap-2 text-xs font-medium text-accent">
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
									<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
									<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
								</svg>
								Kontynuuj czytanie
							</span>
							<h2 className="mt-1 font-playfairDisplay text-2xl text-mainTxt">
								{book.title}
							</h2>
							<p className="text-sm text-mainTxt/60">{book.author}</p>

							<div className="mt-4">
								<div className="flex items-center justify-between text-xs text-mainTxt/60 mb-1.5">
									<span>
										Rozdział {book.current_chapter_index + 1} z{" "}
										{book.chapter_count}
									</span>
									<span className="tabular-nums">
										{book.chapter_count > 0
											? Math.round(
													((book.current_chapter_index + 1) /
														book.chapter_count) *
														100,
												)
											: 0}
										%
									</span>
								</div>
								<div className="h-2 w-full overflow-hidden rounded-full bg-accent/15">
									<div
										className="h-full rounded-full bg-linear-to-r from-accent to-accentSecondary"
										style={{
											width: `${
												book.chapter_count > 0
													? Math.round(
															((book.current_chapter_index + 1) /
																book.chapter_count) *
																100,
														)
													: 0
											}%`,
										}}
									/>
								</div>
							</div>

							<Link
								href={`/dashboard/czytam/${book.id}`}
								className="mt-5 inline-flex items-center gap-2 self-center sm:self-start px-5 py-2.5 rounded-full bg-linear-to-r from-accent to-accentSecondary text-panel text-sm font-medium shadow-sm transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95">
								Czytaj dalej
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
									<polyline points="9 18 15 12 9 6"></polyline>
								</svg>
							</Link>
						</div>
					</div>
					<div className="hidden lg:block w-px bg-accent/20 self-stretch" />
					<div className="flex items-start gap-3 xl:w-100 xl:ml-5">
						<div className="relative text-sm text-mainTxt/70 leading-relaxed space-y-3">
							<p>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit
								est debitis recusandae adipisci consectetur itaque dolor, vel
								error quod reiciendis neque similique. Sed, temporibus eius.
							</p>

							<span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round">
									<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
									<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
								</svg>
								Klasyka
							</span>
						</div>
					</div>
				</div>
			) : (
				<div className="bg-panel/60 border border-accent/20 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center text-center gap-2 min-h-48">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-accent/60">
						<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
						<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
					</svg>
					<p className="font-playfairDisplay text-lg text-mainTxt">
						Nie czytasz teraz żadnej książki
					</p>
					<p className="italic text-sm text-mainTxt/60 max-w-sm font-lora">
						„Nie ma przyjaciela równie lojalnego jak książka.”{" "}
						<span className="not-italic text-mainTxt/40">
							- Ernest Hemingway
						</span>
					</p>
				</div>
			)}
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
				<div className="stats bg-panel/60 border border-accent/20 rounded-2xl p-5 text-mainTxt">
					<div className="stats-head flex items-center gap-2 font-playfairDisplay text-xl mb-5">
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
							className="stroke-accent w-6 shrink-0">
							<line x1="12" y1="20" x2="12" y2="10"></line>
							<line x1="18" y1="20" x2="18" y2="4"></line>
							<line x1="6" y1="20" x2="6" y2="16"></line>
						</svg>
						Twoje statystyki
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 font-playfairDisplay gap-5">
						<div className="card bg-main p-4 rounded-xl flex items-start gap-4">
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
								className="w-6 stroke-accent mt-2 shrink-0">
								<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
								<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
							</svg>
							<div className="card-head flex flex-col gap-2">
								<span className="text-2xl md:text-3xl">{readCount}</span>
								<span className="text-sm md:text-md">
									przeczytanych książek
								</span>
							</div>
						</div>

						<div className="card bg-main p-4 rounded-xl flex items-start gap-4">
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
								className="w-6 stroke-accent mt-2 shrink-0">
								<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
							</svg>
							<div className="card-head flex flex-col gap-2">
								<span className="text-2xl md:text-3xl">{favoritesCount}</span>
								<span className="text-sm md:text-md">ulubionych książek</span>
							</div>
						</div>
					</div>
				</div>

				<div className="last-added p-5 bg-panel/60 border border-accent/20 rounded-2xl text-mainTxt">
					<div className="flex items-center gap-2 font-playfairDisplay text-xl mb-5">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 640 640"
							className="fill-accent w-6 shrink-0">
							<path d="M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z" />
						</svg>
						<span>Ostatnio dodane</span>
						<Link
							href="/dashboard/czytam"
							className="text-sm font-montserrat flex items-center text-accent hover:underline ml-auto">
							Zobacz wszystkie{" "}
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
								className="w-4 ml-1.5 shrink-0">
								<line x1="5" y1="12" x2="19" y2="12"></line>
								<polyline points="12 5 19 12 12 19"></polyline>
							</svg>
						</Link>
					</div>
					<ul className="last-added-list">
						{books.length > 0 ? (
							books.map((book) => (
								<li
									key={book.id}
									className="flex items-center gap-4 py-3 border-b border-accent/10 last:border-b-0">
									<Link
										href={`/dashboard/czytam/${book.id}`}
										className="py-3 flex items-center gap-4 flex-1 min-w-0 group">
										{book.cover_url ? (
											<Image
												width={40}
												height={60}
												alt=""
												src={book.cover_url}
												className="w-10 aspect-2/3 rounded-md object-cover shrink-0"
											/>
										) : (
											<div className="relative w-10 aspect-2/3 shrink-0 overflow-hidden rounded-md border-2 border-accent/20 bg-accent/10 flex items-center justify-center text-accent/40">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="18"
													height="18"
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
										<div className="flex flex-col min-w-0">
											<span className="font-playfairDisplay text-mainTxt truncat group-hover:text-accent transition-colors duration-300">
												{book.title}
											</span>
											<span className="text-sm text-mainTxt/60 truncate">
												{book.author}
											</span>
										</div>
									</Link>
									<div className="flex items-center gap-1.5 text-xs text-mainTxt/50 shrink-0 font-montserrat">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round">
											<rect
												x="3"
												y="4"
												width="18"
												height="18"
												rx="2"
												ry="2"></rect>
											<line x1="16" y1="2" x2="16" y2="6"></line>
											<line x1="8" y1="2" x2="8" y2="6"></line>
											<line x1="3" y1="10" x2="21" y2="10"></line>
										</svg>
										<span>
											{new Date(book.created_at).toLocaleDateString("pl-PL", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</span>
									</div>
								</li>
							))
						) : (
							<li className="py-3 text-sm text-mainTxt/50">
								Nie dodano jeszcze żadnej książki
							</li>
						)}
					</ul>
				</div>
			</div>
		</div>
	);
}
