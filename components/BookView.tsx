"use client";
import { HeaderTitleContext } from "@/lib/headerTitleContext";
import { supabaseClient } from "@/lib/supabase";
import {
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import type { BookInfo, Note } from "@/lib/types";
import { UploadInfoContext } from "@/lib/UploadInfoContext";
import { ViewPrefsContext } from "@/lib/ViewPrefsContext";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";

const FONT_FAMILY_VALUES: Record<string, string> = {
	Lora: "var(--font-lora), serif",
	"Playfair Display": "var(--font-playfairDisplay), serif",
	Montserrat: "var(--font-montserrat), sans-serif",
	Georgia: "Georgia, serif",
	Merriweather: "var(--font-merriweather), serif",
};
const FONT_OPTIONS = Object.keys(FONT_FAMILY_VALUES);

const FONT_SIZE_VALUES: Record<string, string> = {
	Mała: "1rem",
	Średnia: "1.2rem",
	Duża: "1.35rem",
	"Bardzo duża": "1.5rem",
	Ogromna: "1.7rem",
};
const FONT_SIZE_OPTIONS = Object.keys(FONT_SIZE_VALUES);

const LINE_HEIGHT_VALUES: Record<string, string> = {
	Wąski: "1.5",
	Normalny: "1.85",
	Szeroki: "2.1",
	"Bardzo szeroki": "2.35",
	Maksymalny: "2.6",
};
const LINE_HEIGHT_OPTIONS = Object.keys(LINE_HEIGHT_VALUES);
const SOUND_VALUES: Record<string, string> = {
	Wyłączony: "",
	Deszcz: "/audios/rain-sound.mp3",
	Kominek: "/audios/fireplace-sound.mp3",
	Kawiarnia: "/audios/cafe-sound.mp3",
	"Biały szum": "/audios/white-noise-sound.mp3",
	Ocean: "/audios/ocean-sound.mp3",
};
const SOUND_OPTIONS = Object.keys(SOUND_VALUES);

type ReaderMenu = "font" | "fontSize" | "lineHeight" | "sound" | "width";

const NOTE_POPUP_WIDTH = 256;

type ReaderPrefs = {
	font: string;
	fontSize: string;
	lineHeight: string;
	contentWidth: number;
};

const isReaderPrefs = (value: unknown): value is ReaderPrefs => {
	if (typeof value !== "object" || value === null) return false;

	const data = value as Record<string, unknown>;

	return (
		typeof data.font === "string" &&
		typeof data.fontSize === "string" &&
		typeof data.lineHeight === "string" &&
		typeof data.contentWidth === "number"
	);
};

const markAsRead = async (id: string) => {
	const { error } = await supabaseClient
		.from("books")
		.update({ has_been_read: true })
		.eq("id", id);

	if (error) {
		console.error(error);
		return;
	}
};
const removeFromRead = async (id: string) => {
	const { error } = await supabaseClient
		.from("books")
		.update({ has_been_read: false })
		.eq("id", id);
	if (error) {
		console.error(error);
		return;
	}
};

const saveReaderPrefs = (prefs: ReaderPrefs) => {
	localStorage.setItem("readerPrefs", JSON.stringify(prefs));
};

const getReaderPrefs = (): ReaderPrefs | undefined => {
	const raw = localStorage.getItem("readerPrefs");
	if (!raw) return undefined;

	try {
		const parsed: unknown = JSON.parse(raw);
		if (!isReaderPrefs(parsed)) return undefined;

		return parsed;
	} catch {
		return undefined;
	}
};

function ReaderOptionMenu({
	label,
	icon,
	options,
	selected,
	onSelect,
	isOpen,
	onToggle,
}: {
	label: string;
	icon: React.ReactNode;
	options: string[];
	selected: string;
	onSelect: (value: string) => void;
	isOpen: boolean;
	onToggle: () => void;
}) {
	return (
		<div className="relative group">
			<button
				aria-label={label}
				onClick={onToggle}
				className={`flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-colors duration-300 shrink-0 ${isOpen ? "bg-accent text-panel" : "bg-accent/10 text-accent hover:bg-accent/20"}`}>
				{icon}
			</button>

			{!isOpen && (
				<span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-panel border border-accent/30 px-2 py-1 text-xs text-mainTxt shadow-lg opacity-0 scale-95 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:scale-100">
					{label}
				</span>
			)}

			{isOpen && (
				<ul className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 min-w-50 w-max p-2 rounded-xl bg-panel border border-accent/30 shadow-lg overflow-hidden z-10">
					<li className="px-3 pb-2">
						<span className="block pt-1 text-xs font-semibold uppercase tracking-wide text-accent/70">
							{label}
						</span>
						<span className="mt-2 block h-px bg-accent/20 rounded-full" />
					</li>
					{options.map((option) => (
						<li key={option}>
							<button
								onClick={() => onSelect(option)}
								className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left text-mainTxt cursor-pointer transition-colors duration-200 hover:bg-accent/10 rounded-lg ${selected === option ? "font-semibold" : ""}`}>
								{option}
								{selected === option && (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-accent shrink-0">
										<polyline points="20 6 9 17 4 12"></polyline>
									</svg>
								)}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default function BookView({ response }: { response: BookInfo }) {
	const titleContext = useContext(HeaderTitleContext);
	const uploadInfoContext = useContext(UploadInfoContext);
	const viewPrefsContext = useContext(ViewPrefsContext);
	const [pageIndex, setPageIndex] = useState<number>(
		response.success ? response.current_chapter_index : 0,
	);

	const bookContainerRef = useRef<HTMLDivElement | null>(null);
	const bookContentRef = useRef<HTMLDivElement | null>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const isFirstPageIndexRenderRef = useRef(true);

	const [notesMode, setNotesMode] = useState(false);
	const [notes, setNotes] = useState<Note[] | []>([]);
	const [notePositions, setNotePositions] = useState<
		Record<string, { left: number; top: number }>
	>({});
	const [openNote, setOpenNote] = useState<{
		id: string;
		openLeft: boolean;
	} | null>(null);
	const [noteDraft, setNoteDraft] = useState({ title: "", description: "" });
	const [chapterProgress, setChapterProgress] = useState(0);

	const [openMenu, setOpenMenu] = useState<ReaderMenu | null>(null);
	const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
	const [selectedFontSize, setSelectedFontSize] = useState(
		FONT_SIZE_OPTIONS[1],
	);
	const [selectedLineHeight, setSelectedLineHeight] = useState(
		LINE_HEIGHT_OPTIONS[1],
	);
	const [isRead, setIsRead] = useState(
		response.success ? response.has_been_read : false,
	);
	const [readLabel, setReadLabel] = useState(
		response.success && response.has_been_read
			? "Usuń z przeczytanych"
			: "Oznacz jako przeczytane",
	);
	const [selectedSound, setSelectedSound] = useState(SOUND_OPTIONS[0]);
	const [contentWidth, setContentWidth] = useState(100);
	const [showFocusModeMessage, setShowFocusModeMessage] = useState(false);
	const router = useRouter();

	const isFocusModeActive =
		!viewPrefsContext.viewPrefs.isHeaderVisible &&
		!viewPrefsContext.viewPrefs.isReaderPanelVisible;

	useEffect(() => {
		if (!isFocusModeActive) return;

		setShowFocusModeMessage(true);

		const timeout = setTimeout(() => {
			setShowFocusModeMessage(false);
		}, 4000);

		return () => clearTimeout(timeout);
	}, [isFocusModeActive]);

	useEffect(() => {
		const prefs = getReaderPrefs();
		if (!prefs) return;

		setSelectedFont(prefs.font);
		setSelectedFontSize(prefs.fontSize);
		setSelectedLineHeight(prefs.lineHeight);
		setContentWidth(prefs.contentWidth);

		document.documentElement.style.setProperty(
			"--book-font-family",
			FONT_FAMILY_VALUES[prefs.font],
		);
		document.documentElement.style.setProperty(
			"--book-font-size",
			FONT_SIZE_VALUES[prefs.fontSize],
		);
		document.documentElement.style.setProperty(
			"--book-line-height",
			LINE_HEIGHT_VALUES[prefs.lineHeight],
		);
	}, []);

	const enterFocusMode = () => {
		viewPrefsContext.setViewPrefs(() => {
			localStorage.setItem(
				"viewPrefs",
				JSON.stringify({
					isDesktopAsideOpen: false,
					isHeaderVisible: false,
					isReaderPanelVisible: false,
				}),
			);

			return {
				isDesktopAsideOpen: false,
				isHeaderVisible: false,
				isReaderPanelVisible: false,
			};
		});
	};

	const handlePageChange = async (newIndex: number) => {
		if (!response.success) return;

		await supabaseClient
			.from("books")
			.update({ current_chapter_index: newIndex, scroll_position: 0 })
			.eq("id", response.book_id);
	};

	const toggleMenu = (menu: ReaderMenu) =>
		setOpenMenu((prev) => (prev === menu ? null : menu));

	const leaveFocusMode = () => {
		setShowFocusModeMessage(false);

		viewPrefsContext.setViewPrefs((prev) => {
			localStorage.setItem(
				"viewPrefs",
				JSON.stringify({
					...prev,
					isHeaderVisible: true,
					isReaderPanelVisible: true,
				}),
			);
			return {
				...prev,
				isHeaderVisible: true,
				isReaderPanelVisible: true,
			};
		});
	};

	const handleNotes = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const target = e.target as HTMLElement;
		const paragraph = target.closest<HTMLElement>("[data-paragraph-index]");

		if (!paragraph) return;

		const paragraphIndex = Number(paragraph.dataset.paragraphIndex);
		const id = crypto.randomUUID();
		const openLeft =
			paragraph.getBoundingClientRect().left + NOTE_POPUP_WIDTH >
			window.innerWidth;

		setNotes((prev) => [
			...prev,
			{
				id,
				paragraphIndex,
				title: "",
				description: "",
				chapterIndex: pageIndex,
			},
		]);

		setNoteDraft({ title: "", description: "" });
		setOpenNote({ id, openLeft });
	};

	const saveNote = (id: string) => {
		setNotes((prev) =>
			prev.map((note) =>
				note.id === id
					? {
							...note,
							title: noteDraft.title.trim(),
							description: noteDraft.description.trim(),
						}
					: note,
			),
		);
		setOpenNote(null);
	};

	useLayoutEffect(() => {
		const bookContent =
			bookContentRef.current?.querySelector<HTMLElement>(".book-content");

		if (!bookContent) return;

		bookContent
			.querySelectorAll<HTMLElement>(
				"p, h1, h2, h3, h4, h5, h6, blockquote, li",
			)
			.forEach((element, index) => {
				element.dataset.paragraphIndex = String(index);
				element.classList.add("p-2");
			});
	}, [pageIndex]);

	useLayoutEffect(() => {
		const wrapper = bookContentRef.current;

		if (!wrapper) return;

		const recomputePositions = () => {
			const wrapperRect = wrapper.getBoundingClientRect();
			const positions: Record<string, { left: number; top: number }> = {};

			notes
				.filter((note) => note.chapterIndex === pageIndex)
				.forEach((note) => {
					const paragraph = wrapper.querySelector<HTMLElement>(
						`[data-paragraph-index="${note.paragraphIndex}"]`,
					);

					if (!paragraph) return;

					const paragraphRect = paragraph.getBoundingClientRect();

					positions[note.id] = {
						left: paragraphRect.left - wrapperRect.left,
						top: paragraphRect.top - wrapperRect.top,
					};
				});

			setNotePositions(positions);
		};

		recomputePositions();

		window.addEventListener("resize", recomputePositions);

		return () => window.removeEventListener("resize", recomputePositions);
	}, [
		notes,
		pageIndex,
		contentWidth,
		selectedFont,
		selectedFontSize,
		selectedLineHeight,
	]);

	useEffect(() => {
		if (!response.success) {
			uploadInfoContext.setUploadingFileInfo({
				success: response.success,
				message: response.message,
			});
			return;
		}

		titleContext.setTitle(response.title);
		titleContext.setAuthor(response.author);

		if (bookContainerRef.current) {
			const refs = bookContainerRef.current;

			const currentScrollPosition =
				response.scroll_position * (refs.scrollHeight - refs.clientHeight);

			refs.scrollTo({
				top: currentScrollPosition,
				behavior: "smooth",
			});
		}

		return () => {
			titleContext.setTitle(undefined);
			titleContext.setAuthor(undefined);
		};
	}, [titleContext, response, uploadInfoContext]);

	useEffect(() => {
		if (isFirstPageIndexRenderRef.current) {
			isFirstPageIndexRenderRef.current = false;
			return;
		}

		if (bookContainerRef.current) {
			bookContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, [pageIndex]);

	useEffect(() => {
		const refs = bookContainerRef.current;
		if (refs) {
			let id: undefined | NodeJS.Timeout;

			const saveScrollProgress = async () => {
				if (refs.scrollHeight === refs.clientHeight) return;

				const scrollPosition =
					refs.scrollTop / (refs.scrollHeight - refs.clientHeight);

				if (response.success) {
					const { error } = await supabaseClient
						.from("books")
						.update({ scroll_position: scrollPosition })
						.eq("id", response.book_id);

					if (error) {
						console.error("Błąd pobierania danych o postępie scrollowania");
						return;
					}
				}
			};

			const handleScroll = () => {
				clearTimeout(id);
				id = setTimeout(saveScrollProgress, 10000);
			};

			refs.addEventListener("scroll", handleScroll);

			return () => {
				refs.removeEventListener("scroll", handleScroll);
				clearTimeout(id);
			};
		}
	}, []);

	useEffect(() => {
		const container = bookContainerRef.current;

		if (!container) return;

		const updateChapterProgress = () => {
			const scrollable = container.scrollHeight - container.clientHeight;

			setChapterProgress(
				scrollable > 0 ? (container.scrollTop / scrollable) * 100 : 100,
			);
		};

		updateChapterProgress();

		container.addEventListener("scroll", updateChapterProgress, {
			passive: true,
		});
		window.addEventListener("resize", updateChapterProgress);

		return () => {
			container.removeEventListener("scroll", updateChapterProgress);
			window.removeEventListener("resize", updateChapterProgress);
		};
	}, [pageIndex]);

	if (!response.success) {
		return (
			<div className="flex flex-col items-center text-center p-4 py-2 w-full h-full text-mainTxt gap-2 font-lora overflow-y-auto scrollbar-accent">
				<Image
					className="block w-[min(100%,450px)]"
					width={1659}
					height={948}
					src="/dashboardAssets/bookNotFound.webp"
					alt=""
				/>
				<h1 className="text-mainTxt text-[2rem] tracking-[2px]">
					Nie udało się pobrać książki
				</h1>
				<p className="max-w-md text-mainTxt/60">
					Coś poszło nie tak podczas ładowania tej książki. Może to być chwilowy
					problem z połączeniem, albo książka jest obecnie niedostępna.
				</p>
				<Link
					href="/dashboard/home"
					className="flex items-center mt-2 gap-2 px-6 py-3 rounded-full bg-linear-to-r from-accent to-accentSecondary text-panel text-sm font-medium shadow-sm transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95">
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
						<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
						<polyline points="9 22 9 12 15 12 15 22"></polyline>
					</svg>
					Wróć do strony głównej
				</Link>
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
					„Czasem to, co nas zatrzymuje, prowadzi do czegoś piękniejszego.”
				</blockquote>
				<span className="text-sm text-mainTxt/50">- Paulo Coelho</span>
			</div>
		);
	}

	const { title, author, chapters } = response;

	return (
		<>
			<div
				aria-hidden
				className="absolute inset-x-0 top-0 h-[1.5px] z-20 pointer-events-none">
				<div
					className="h-full bg-accent"
					style={{ width: `${chapterProgress}%` }}
				/>
			</div>
			<div
				onClick={leaveFocusMode}
				className="relative w-full h-full overflow-hidden">
				<div
					ref={bookContainerRef}
					className={`w-full h-full ${isFocusModeActive ? "scrollbar-none" : "scrollbar-accent"} text-mainTxt font-lora overflow-y-auto`}>
					<div
						aria-hidden
						className="fixed -z-10 top-10 -left-24 w-80 h-80 rounded-full bg-accent/5 blur-3xl pointer-events-none"
					/>
					<div
						aria-hidden
						className="fixed -z-10 bottom-10 -right-24 w-96 h-96 rounded-full bg-accentSecondary/5 blur-3xl pointer-events-none"
					/>
					<div
						className={`container px-0 mx-auto lg:px-4 ${isFocusModeActive ? "pt-0" : "py-20"} space-y-5`}>
						<div
							className={`text-center ${isFocusModeActive ? "pb-0 overflow-hidden h-0" : "pb-6 border-b border-accent/20"}`}>
							<div className="flex items-center">
								<button
									className="p-1 rounded-lg cursor-pointer hover:bg-accent/5 transition-colors duration-300 shrink-0"
									onClick={(e) => {
										e.stopPropagation();
										router.push("/dashboard/czytam");
									}}>
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
										className="feather feather-arrow-left stroke-accent">
										<line x1="19" y1="12" x2="5" y2="12"></line>
										<polyline points="12 19 5 12 12 5"></polyline>
									</svg>
								</button>
								<h1 className="text-3xl sm:text-4xl font-semibold italic grow text-center">
									{title}
								</h1>
							</div>
							<div className="mx-auto mt-4 h-px w-12 bg-accent" />
							<p className="mt-4 text-xs sm:text-sm uppercase tracking-[0.25em] text-mainTxt/60">
								{author}
							</p>
						</div>
						<div className="relative" ref={bookContentRef}>
							<div
								onClick={(e) => {
									if (!notesMode) return;

									handleNotes(e);
								}}

								className={`book-content px-4 mx-auto ${notesMode ? "**:data-paragraph-index:cursor-pointer **:data-paragraph-index:rounded-md **:data-paragraph-index:transition-colors **:data-paragraph-index:hover:bg-accent/10" : ""}`}
								style={{ width: `${contentWidth}%` }}
								dangerouslySetInnerHTML={{
									__html: chapters[pageIndex]?.content,
								}}
							/>
							{notes
								.filter((note) => note.chapterIndex === pageIndex)
								.map((note) => {
									const position = notePositions[note.id];

									if (!position) return null;

									return (
										<div
											key={note.id}
											style={{
												left: `${position.left}px`,
												top: `${position.top}px`,
											}}
											className="absolute">
											<button
												onClick={(e) => {
													e.stopPropagation();

													if (openNote?.id === note.id) {
														setOpenNote(null);
														return;
													}

													const wrapperRect =
														bookContentRef.current?.getBoundingClientRect();
													const markerViewportX =
														(wrapperRect?.left ?? 0) + position.left;
													const openLeft =
														markerViewportX + NOTE_POPUP_WIDTH >
														window.innerWidth;

													setNoteDraft({
														title: note.title,
														description: note.description,
													});
													setOpenNote({ id: note.id, openLeft });
												}}
												aria-label="Tutaj jest notatka"
												className="flex items-center justify-center w-7 h-7 rounded-full bg-accent text-panel shadow-sm cursor-pointer transition-colors duration-300 hover:brightness-110">
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
													<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
												</svg>
											</button>

											{openNote?.id === note.id && (
												<form
													onClick={(e) => e.stopPropagation()}
													onSubmit={(e) => {
														e.preventDefault();
														saveNote(note.id);
													}}
													className={`absolute top-full mt-2 w-64 flex flex-col gap-2 bg-panel border border-accent/30 rounded-lg p-4 shadow-lg z-10 text-mainTxt ${openNote.openLeft ? "right-0" : "left-0"}`}>
													<input
														value={noteDraft.title}
														onChange={(e) =>
															setNoteDraft((prev) => ({
																...prev,
																title: e.target.value,
															}))
														}
														placeholder="Tytuł notatki"
														className="w-full border border-accent/30 rounded-md bg-transparent px-2 py-1.5 text-sm outline-0 focus:border-accent transition-colors"
													/>
													<textarea
														value={noteDraft.description}
														onChange={(e) =>
															setNoteDraft((prev) => ({
																...prev,
																description: e.target.value,
															}))
														}
														placeholder="Opis notatki"
														rows={4}
														className="w-full resize-none border border-accent/30 rounded-md bg-transparent px-2 py-1.5 text-sm outline-0 focus:border-accent transition-colors"
													/>
													<button
														type="submit"
														className="self-end px-4 py-1.5 rounded-full bg-linear-to-r from-accent to-accentSecondary text-panel text-sm font-medium cursor-pointer transition-[filter] duration-300 hover:brightness-110">
														Zapisz
													</button>
												</form>
											)}
										</div>
									);
								})}
						</div>
					</div>
				</div>

				<div
					onClick={(e) => e.stopPropagation()}
					className={`fixed md:absolute ${viewPrefsContext.viewPrefs.isReaderPanelVisible ? "bottom-0 sm:bottom-2" : "-bottom-50"}  left-1/2 -translate-x-1/2 w-full sm:w-[80%] max-w-150 mx-auto flex flex-col flex-wrap justify-center sm:flex-row items-center gap-4 px-4 py-2 sm:rounded-full bg-panel/95 backdrop-blur-sm border border-accent/30 shadow-lg z-100 transition-[bottom] duration-300 font-lora`}>
					<div className="pages flex gap-3 items-center">
						<div className="relative group flex items-center justify-center">
							<button
								disabled={pageIndex === 0}
								onClick={async () => {
									const newIndex = Math.max(0, pageIndex - 1);
									setPageIndex(newIndex);
									await handlePageChange(newIndex);
								}}
								className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-r from-accent to-accentSecondary text-panel shadow-sm transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shrink-0">
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
									<polyline points="15 18 9 12 15 6"></polyline>
								</svg>
							</button>
							<span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-panel border border-accent/30 px-2 py-1 text-xs text-mainTxt shadow-lg opacity-0 scale-95 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:scale-100">
								Poprzedni rozdział
							</span>
						</div>

						<span className="text-mainTxt text-sm font-medium tabular-nums text-center">
							Strona {pageIndex + 1} / {chapters.length}
						</span>

						<div className="relative group flex items-center justify-center">
							<button
								disabled={pageIndex === chapters.length - 1}
								onClick={async () => {
									const newIndex = Math.min(chapters.length - 1, pageIndex + 1);
									setPageIndex(newIndex);
									await handlePageChange(newIndex);
								}}
								className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-r from-accent to-accentSecondary text-panel shadow-sm transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shrink-0">
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
									<polyline points="9 18 15 12 9 6"></polyline>
								</svg>
							</button>
							<span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-panel border border-accent/30 px-2 py-1 text-xs text-mainTxt shadow-lg opacity-0 scale-95 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:scale-100">
								Następny rozdział
							</span>
						</div>
						<div className="ml-2 w-px h-6 bg-accent/20 shrink-0 hidden sm:block" />
						{pageIndex === chapters.length - 1 && (
							<div className="relative group flex items-center justify-center">
								<button
									onClick={(e) => {
										e.stopPropagation();

										if (isRead) {
											removeFromRead(response.book_id);
											setIsRead(false);
											setReadLabel("Oznacz jako przeczytane");
										} else {
											markAsRead(response.book_id);
											setIsRead(true);
											setReadLabel("Usuń z przeczytanych");
										}
									}}
									className="py-1 px-2 rounded-lg hover:bg-accent/5 transition-colors duration-300 cursor-pointer">
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
										className={`w-4.5 ${isRead ? "stroke-accent" : "stroke-mainTxt"}`}>
										<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
										<polyline points="22 4 12 14.01 9 11.01"></polyline>
									</svg>
								</button>
								<span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-panel border border-accent/30 px-2 py-1 text-xs text-mainTxt shadow-lg opacity-0 scale-95 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:scale-100">
									{readLabel}
								</span>
							</div>
						)}
					</div>

					<div className="flex items-center gap-2">
						<ReaderOptionMenu
							label="Zmień czcionkę"
							options={FONT_OPTIONS}
							selected={selectedFont}
							onSelect={(value) => {
								setSelectedFont(value);
								document.documentElement.style.setProperty(
									"--book-font-family",
									FONT_FAMILY_VALUES[value],
								);
								saveReaderPrefs({
									font: value,
									fontSize: selectedFontSize,
									lineHeight: selectedLineHeight,
									contentWidth,
								});
								setOpenMenu(null);
							}}
							isOpen={openMenu === "font"}
							onToggle={() => toggleMenu("font")}
							icon={
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
									<polyline points="4 7 4 4 20 4 20 7"></polyline>
									<line x1="9" y1="20" x2="15" y2="20"></line>
									<line x1="12" y1="4" x2="12" y2="20"></line>
								</svg>
							}
						/>

						<ReaderOptionMenu
							label="Zmień rozmiar tekstu"
							options={FONT_SIZE_OPTIONS}
							selected={selectedFontSize}
							onSelect={(value) => {
								setSelectedFontSize(value);
								document.documentElement.style.setProperty(
									"--book-font-size",
									FONT_SIZE_VALUES[value],
								);
								saveReaderPrefs({
									font: selectedFont,
									fontSize: value,
									lineHeight: selectedLineHeight,
									contentWidth,
								});
								setOpenMenu(null);
							}}
							isOpen={openMenu === "fontSize"}
							onToggle={() => toggleMenu("fontSize")}
							icon={<span className="text-sm font-semibold">Aa</span>}
						/>

						<ReaderOptionMenu
							label="Zmień odstępy między liniami"
							options={LINE_HEIGHT_OPTIONS}
							selected={selectedLineHeight}
							onSelect={(value) => {
								setSelectedLineHeight(value);
								document.documentElement.style.setProperty(
									"--book-line-height",
									LINE_HEIGHT_VALUES[value],
								);
								saveReaderPrefs({
									font: selectedFont,
									fontSize: selectedFontSize,
									lineHeight: value,
									contentWidth,
								});
								setOpenMenu(null);
							}}
							isOpen={openMenu === "lineHeight"}
							onToggle={() => toggleMenu("lineHeight")}
							icon={
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
									<line x1="4" y1="6" x2="20" y2="6"></line>
									<line x1="4" y1="12" x2="20" y2="12"></line>
									<line x1="4" y1="18" x2="20" y2="18"></line>
								</svg>
							}
						/>

						<ReaderOptionMenu
							label="Włącz dźwięk"
							options={SOUND_OPTIONS}
							selected={selectedSound}
							onSelect={(value) => {
								const sound = value;
								setSelectedSound(sound);
								setOpenMenu(null);

								if (audioRef.current) {
									if (SOUND_VALUES[sound] !== "") {
										audioRef.current.src = SOUND_VALUES[sound];
										audioRef.current.play();
									} else {
										audioRef.current.pause();
									}
								}
							}}
							isOpen={openMenu === "sound"}
							onToggle={() => toggleMenu("sound")}
							icon={
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
									<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
									<path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
								</svg>
							}
						/>

						<div className="relative group">
							<button
								aria-label="Szerokość treści"
								onClick={() => toggleMenu("width")}
								className={`flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-colors duration-300 shrink-0 ${openMenu === "width" ? "bg-accent text-panel" : "bg-accent/10 text-accent hover:bg-accent/20"}`}>
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
									<polyline points="18 8 22 12 18 16"></polyline>
									<polyline points="6 8 2 12 6 16"></polyline>
									<line x1="2" y1="12" x2="22" y2="12"></line>
								</svg>
							</button>

							{openMenu !== "width" && (
								<span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-panel border border-accent/30 px-2 py-1 text-xs text-mainTxt shadow-lg opacity-0 scale-95 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:scale-100">
									Szerokość treści
								</span>
							)}

							{openMenu === "width" && (
								<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 p-3 rounded-xl bg-panel border border-accent/30 shadow-lg z-10">
									<span className="block text-xs font-semibold uppercase tracking-wide text-accent/70">
										Szerokość treści
									</span>
									<span className="mt-2 block h-px bg-accent/20 rounded-full" />
									<div className="mt-3 flex items-center gap-3">
										<input
											type="range"
											min={50}
											max={100}
											step={5}
											value={contentWidth}
											onChange={(e) => {
												const value = Number(e.target.value);
												setContentWidth(value);
												saveReaderPrefs({
													font: selectedFont,
													fontSize: selectedFontSize,
													lineHeight: selectedLineHeight,
													contentWidth: value,
												});
											}}
											className="w-full accent-accent cursor-pointer"
										/>
										<span className="text-xs font-medium tabular-nums text-mainTxt/70 w-9 text-right">
											{contentWidth}%
										</span>
									</div>
								</div>
							)}
						</div>
						<div className="relative group flex items-center justify-center">
							<button
								onClick={enterFocusMode}
								aria-label="Włącz tryb skupienia"
								className="flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-colors duration-300 shrink-0 bg-accent/10 text-accent hover:bg-accent/20">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 640 640"
									width={18}
									height={18}
									fill="currentColor"
									className="">
									<path d="M73.4 73.4C85.9 60.9 106.1 60.9 118.6 73.4L192 146.7L192 128C192 110.3 206.3 96 224 96C241.7 96 256 110.3 256 128L256 224C256 241.7 241.7 256 224 256L128 256C110.3 256 96 241.7 96 224C96 206.3 110.3 192 128 192L146.7 192L73.3 118.6C60.9 106.1 60.9 85.9 73.4 73.4zM264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320zM566.6 118.6L493.3 192L512 192C529.7 192 544 206.3 544 224C544 241.7 529.7 256 512 256L416 256C398.3 256 384 241.7 384 224L384 128C384 110.3 398.3 96 416 96C433.7 96 448 110.3 448 128L448 146.7L521.4 73.3C533.9 60.8 554.2 60.8 566.7 73.3C579.2 85.8 579.2 106.1 566.7 118.6zM521.3 566.6L448 493.3L448 512C448 529.7 433.7 544 416 544C398.3 544 384 529.7 384 512L384 416C384 398.3 398.3 384 416 384L512 384C529.7 384 544 398.3 544 416C544 433.7 529.7 448 512 448L493.3 448L566.7 521.4C579.2 533.9 579.2 554.2 566.7 566.7C554.2 579.2 533.9 579.2 521.4 566.7zM73.4 521.4L146.7 448L128 448C110.3 448 96 433.7 96 416C96 398.3 110.3 384 128 384L224 384C241.7 384 256 398.3 256 416L256 512C256 529.7 241.7 544 224 544C206.3 544 192 529.7 192 512L192 493.3L118.6 566.7C106.1 579.2 85.8 579.2 73.3 566.7C60.8 554.2 60.8 533.9 73.3 521.4z" />
								</svg>
							</button>
							<span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-panel border border-accent/30 px-2 py-1 text-xs text-mainTxt shadow-lg opacity-0 scale-95 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:scale-100">
								Włącz tryb skupienia
							</span>
						</div>
						<div className="relative group flex items-center justify-center">
							<button
								onClick={(e) => {
									e.stopPropagation();
									setNotesMode((p) => !p);
								}}
								aria-label="Dodaj notatkę"
								className={`flex items-center ${notesMode ? "bg-accent/30 transition-none" : "bg-accent/10 hover:bg-accent/20 transition-colors"} justify-center w-9 h-9 rounded-full cursor-pointer duration-300 shrink-0 text-accent`}>
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
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
									<polyline points="14 2 14 8 20 8"></polyline>
									<line x1="16" y1="13" x2="8" y2="13"></line>
									<line x1="16" y1="17" x2="8" y2="17"></line>
									<polyline points="10 9 9 9 8 9"></polyline>
								</svg>
							</button>
							<span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-panel border border-accent/30 px-2 py-1 text-xs text-mainTxt shadow-lg opacity-0 scale-95 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:scale-100">
								Dodaj notatkę
							</span>
						</div>
					</div>
				</div>

				<div
					className={`absolute left-1/2 ${showFocusModeMessage ? "bottom-3" : "-bottom-100"} -translate-x-1/2 bg-panel/95 backdrop-blur-sm border border-accent/30 rounded-full p-3 flex items-center justify-center text-center transition-[bottom] duration-300 w-[80%] max-w-max`}>
					<p className="text-mainTxt font-playfairDisplay">
						Włączono tryb skupienia - kliknij gdziekolwiek aby go wyłączyć
					</p>
				</div>

				<div
					onClick={() => setOpenMenu(null)}
					className={`overlay fixed inset-0 z-10 ${openMenu ? "block" : "hidden"}`}></div>
				<audio loop ref={audioRef} src="/audios/cafe-sound.mp3"></audio>
			</div>
		</>
	);
}
