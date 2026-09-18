"use client";

import type { asideProps } from "@/lib/types";
import { useRef } from "react";

export default function DashboardHeader({
	asideOpen,
	onAsideOpenAction,
}: asideProps) {
	const importInputRef = useRef<HTMLInputElement>(null);

	const handleImportedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file) return;
		console.log("Zaimportowano plik:", file.name);
	};

	return (
		<div className="relative dashboard-main w-full h-full flex flex-col">
			<header
				className={`flex px-6 items-center justify-between sticky top-0 bg-linear-to-r from-panel to-main h-17 border-b border-accent/20 transition-[grid-column] duration-500 z-30`}>
				<div className="header-left">
					<button
						onClick={() => onAsideOpenAction((p) => !p)}
						className={`md:hidden manage-sidebar-btn p-1 cursor-pointer transition-colors duration-300 hover:bg-accent/15 rounded-md`}>
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
							className="feather feather-menu stroke-accent">
							<line x1="3" y1="12" x2="21" y2="12"></line>
							<line x1="3" y1="6" x2="21" y2="6"></line>
							<line x1="3" y1="18" x2="21" y2="18"></line>
						</svg>
					</button>
				</div>
				<div className="header-right flex items-center gap-6">
					<button className="relative pro-btn flex items-center gap-2 px-4 py-2.5 rounded-full bg-linear-to-r from-premiumFrom via-premiumVia to-premiumTo text-white text-sm font-semibold cursor-pointer before:content-[''] before:absolute before:bg-linear-to-r before:from-premiumFrom before:via-premiumVia before:to-premiumTo before:-inset-px before:rounded-full before:-z-1 before:blur-[10px] before:opacity-25 before:transition-opacity before:duration-300 hover:before:opacity-50">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 640 640"
							width="18"
							height="18"
							fill="currentColor"
							className="text-premiumGold">
							<path d="M345 151.2C354.2 143.9 360 132.6 360 120C360 97.9 342.1 80 320 80C297.9 80 280 97.9 280 120C280 132.6 285.9 143.9 295 151.2L226.6 258.8C216.6 274.5 195.3 278.4 180.4 267.2L120.9 222.7C125.4 216.3 128 208.4 128 200C128 177.9 110.1 160 88 160C65.9 160 48 177.9 48 200C48 221.8 65.5 239.6 87.2 240L119.8 457.5C124.5 488.8 151.4 512 183.1 512L456.9 512C488.6 512 515.5 488.8 520.2 457.5L552.8 240C574.5 239.6 592 221.8 592 200C592 177.9 574.1 160 552 160C529.9 160 512 177.9 512 200C512 208.4 514.6 216.3 519.1 222.7L459.7 267.3C444.8 278.5 423.5 274.6 413.5 258.9L345 151.2z" />
						</svg>
						<span className="hidden sm:inline">Zdobądź PRO</span>
					</button>
					<button
						onClick={() => importInputRef.current?.click()}
						className="import-btn flex items-center gap-2 px-3 py-2.5 rounded-md bg-linear-to-r from-accent to-accentSecondary text-panel text-sm font-medium shadow-sm cursor-pointer transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95">
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
							<path d="M12 3v12" />
							<path d="M7 10l5 5 5-5" />
							<path d="M4 19h16" />
						</svg>
						<span className="hidden sm:inline">Importuj</span>
					</button>
					<input
						ref={importInputRef}
						onChange={handleImportedFile}
						type="file"
						accept=".epub,.pdf,.mobi"
						className="hidden"
					/>
				</div>
			</header>
			<main className="relative flex-1 min-h-0 overflow-x-hidden overflow-y-auto px-4 pb-20 pt-5 sm:px-7 sm:pt-7">
				<div className="container mx-auto"></div>
			</main>
			<div
				onClick={() => onAsideOpenAction((p) => !p)}
				className={`overlay ${asideOpen ? "block" : "hidden"} fixed inset-0 bg-black/30 z-20 md:hidden`}></div>
		</div>
	);
}
