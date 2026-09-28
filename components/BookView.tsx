"use client";
import { HeaderTitleContext } from "@/lib/headerTitleContext";
import { supabaseClient } from "@/lib/supabase";
import { useContext, useEffect, useRef, useState } from "react";
import type { BookInfo } from "@/lib/types";
import { UploadInfoContext } from "@/lib/UploadInfoContext";
import Image from "next/image";
import Link from "next/link";

const FONT_OPTIONS = [
	"Lora",
	"Playfair Display",
	"Montserrat",
	"Georgia",
	"Merriweather",
];
const FONT_SIZE_OPTIONS = ["Mała", "Średnia", "Duża", "Bardzo duża", "Ogromna"];
const LINE_HEIGHT_OPTIONS = [
	"Wąski",
	"Normalny",
	"Szeroki",
	"Bardzo szeroki",
	"Maksymalny",
];
const SOUND_OPTIONS = [
	"Wyłączony",
	"Deszcz",
	"Kominek",
	"Kawiarnia",
	"Biały szum",
];

type ReaderMenu = "font" | "fontSize" | "lineHeight" | "sound";

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
				<ul className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-44 py-1 rounded-xl bg-panel border border-accent/30 shadow-lg overflow-hidden z-10">
					{options.map((option) => (
						<li key={option}>
							<button
								onClick={() => onSelect(option)}
								className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left text-mainTxt cursor-pointer transition-colors duration-200 hover:bg-accent/10 ${selected === option ? "font-semibold" : ""}`}>
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

	const [openMenu, setOpenMenu] = useState<ReaderMenu | null>(null);
	const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
	const [selectedFontSize, setSelectedFontSize] = useState(
		FONT_SIZE_OPTIONS[1],
	);
	const [selectedLineHeight, setSelectedLineHeight] = useState(
		LINE_HEIGHT_OPTIONS[1],
	);
	const [selectedSound, setSelectedSound] = useState(SOUND_OPTIONS[0]);

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
			<div className="flex flex-col items-center text-center p-4 py-2 w-full h-full bg-paper text-mainTxt border border-accent/30 rounded-2xl gap-2 font-lora overflow-y-auto">
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
				<span className="text-sm text-mainTxt/50">— Paulo Coelho</span>
			</div>
		);
	}

	const { title, author, chapters } = response;

	return (
		<div
			ref={bookContainerRef}
			className="container mx-auto p-4 py-10 w-full h-full bg-paper text-mainTxt border border-accent/30 rounded-2xl space-y-5 font-lora overflow-y-auto">
			<div className="text-center pb-6 border-b border-accent/20">
				<h1 className="text-3xl sm:text-4xl font-semibold italic">{title}</h1>
				<div className="mx-auto mt-4 h-px w-12 bg-accent" />
				<p className="mt-4 text-xs sm:text-sm uppercase tracking-[0.25em] text-mainTxt/60">
					{author}
				</p>
			</div>
			<div
				className="book-content"
				dangerouslySetInnerHTML={{
					__html: chapters[pageIndex]?.content,
				}}></div>

			<div className="absolute bottom-0 sm:bottom-8 left-1/2 -translate-x-1/2 w-full sm:w-[80%] max-w-220 mx-auto flex flex-col sm:flex-row items-center gap-4 px-4 py-2 sm:rounded-full bg-panel/95 backdrop-blur-sm border border-accent/30 shadow-lg">
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
				</div>
				<div className="w-px h-6 bg-accent/20 shrink-0 hidden sm:block" />

				<div className="flex items-center gap-2 sm:ml-auto">
					<ReaderOptionMenu
						label="Zmień czcionkę"
						options={FONT_OPTIONS}
						selected={selectedFont}
						onSelect={(value) => {
							setSelectedFont(value);
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
							setSelectedSound(value);
							setOpenMenu(null);
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
		</div>
	);
}
