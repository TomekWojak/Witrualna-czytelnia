"use client";
import { HeaderTitleContext } from "@/lib/headerTitleContext";
import { supabaseClient } from "@/lib/supabase";
import { useContext, useEffect, useRef, useState } from "react";
import type { BookInfo } from "@/lib/types";
import { UploadInfoContext } from "@/lib/UploadInfoContext";
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

type ReaderMenu = "font" | "fontSize" | "lineHeight" | "sound";

type ReaderPrefs = {
	font: string;
	fontSize: string;
	lineHeight: string;
};

const isReaderPrefs = (value: unknown): value is ReaderPrefs => {
	if (typeof value !== "object" || value === null) return false;

	const data = value as Record<string, unknown>;

	return (
		typeof data.font === "string" &&
		typeof data.fontSize === "string" &&
		typeof data.lineHeight === "string"
	);
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
		<div className="relative">
			<button
				aria-label={label}
				onClick={onToggle}
				className={`flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-colors duration-300 shrink-0 ${isOpen ? "bg-accent text-panel" : "bg-accent/10 text-accent hover:bg-accent/20"}`}>
				{icon}
			</button>

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
	const [pageIndex, setPageIndex] = useState<number>(
		response.success ? response.current_chapter_index : 0,
	);
	const bookContainerRef = useRef<HTMLDivElement | null>(null);
	const audioRef = useRef<HTMLAudioElement>(null);

	const [openMenu, setOpenMenu] = useState<ReaderMenu | null>(null);
	const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
	const [selectedFontSize, setSelectedFontSize] = useState(
		FONT_SIZE_OPTIONS[1],
	);
	const [selectedLineHeight, setSelectedLineHeight] = useState(
		LINE_HEIGHT_OPTIONS[1],
	);
	const [selectedSound, setSelectedSound] = useState(SOUND_OPTIONS[0]);
	const router = useRouter();

	useEffect(() => {
		const prefs = getReaderPrefs();
		if (!prefs) return;

		setSelectedFont(prefs.font);
		setSelectedFontSize(prefs.fontSize);
		setSelectedLineHeight(prefs.lineHeight);

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

	const handlePageChange = async (newIndex: number) => {
		if (!response.success) return;

		await supabaseClient
			.from("books")
			.update({ current_chapter_index: newIndex })
			.eq("id", response.book_id);
	};

	const toggleMenu = (menu: ReaderMenu) =>
		setOpenMenu((prev) => (prev === menu ? null : menu));

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
			bookContainerRef.current.style.scrollBehavior = "smooth";
		}

		return () => {
			titleContext.setTitle(undefined);
			titleContext.setAuthor(undefined);
		};
	}, [titleContext, response, uploadInfoContext]);

	useEffect(() => {
		bookContainerRef.current?.scrollTo(0, 0);
	}, [pageIndex]);

	if (!response.success) {
		return (
			<div className="flex flex-col items-center text-center p-4 py-2 w-full h-full bg-paper text-mainTxt border border-accent/30 rounded-2xl gap-2 font-lora overflow-y-auto scrollbar-accent">
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
		<div
			ref={bookContainerRef}
			className="w-full h-full text-mainTxt font-lora overflow-y-auto scrollbar-accent">
			<div
				aria-hidden
				className="fixed -z-10 top-10 -left-24 w-80 h-80 rounded-full bg-accent/5 blur-3xl pointer-events-none"
			/>
			<div
				aria-hidden
				className="fixed -z-10 bottom-10 -right-24 w-96 h-96 rounded-full bg-accentSecondary/5 blur-3xl pointer-events-none"
			/>
			<div className="container px-0 mx-auto lg:px-4 py-20 w-full space-y-5">
				<div className="text-center pb-6 border-b border-accent/20">
					<div className="flex items-center">
						<button
							className="p-1 rounded-lg cursor-pointer hover:bg-accent/5 transition-colors duration-300 shrink-0"
							onClick={() => router.push("/dashboard/czytam")}>
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
				<div
					className="book-content px-4"
					dangerouslySetInnerHTML={{
						__html: chapters[pageIndex]?.content,
					}}></div>
			</div>

			<div className="absolute bottom-0 sm:bottom-2 left-1/2 -translate-x-1/2 w-full sm:w-[80%] max-w-220 mx-auto flex flex-col sm:flex-row items-center gap-4 px-4 py-2 sm:rounded-full bg-panel/95 backdrop-blur-sm border border-accent/30 shadow-lg">
				<div className="pages flex gap-3 items-center">
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

					<span className="text-mainTxt text-sm font-medium tabular-nums text-center">
						Strona {pageIndex + 1} / {chapters.length}
					</span>

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
					<div className="ml-2 w-px h-6 bg-accent/20 shrink-0 hidden sm:block" />
					{pageIndex === chapters.length - 1 && (
						<div className="relative group flex items-center justify-center">
							<button className="py-1 px-2 rounded-lg hover:bg-accent/5 transition-colors duration-300 cursor-pointer">
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
									className="feather feather-check-circle text-accent w-4.5">
									<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
									<polyline points="22 4 12 14.01 9 11.01"></polyline>
								</svg>
							</button>
							<span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-panel border border-accent/30 px-2 py-1 text-xs text-mainTxt shadow-lg opacity-0 scale-95 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:scale-100">
								Oznacz jako przeczytane
							</span>
						</div>
					)}
				</div>

				<div className="flex items-center gap-2 sm:ml-auto">
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
				</div>
			</div>
			<audio loop ref={audioRef} src="/audios/cafe-sound.mp3"></audio>
		</div>
	);
}
