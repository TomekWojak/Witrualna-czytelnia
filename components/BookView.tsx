"use client";
import { HeaderTitleContext } from "@/lib/headerTitleContext";

import { useContext, useEffect } from "react";
import type { BookInfo } from "@/lib/types";
import { UploadInfoContext } from "@/lib/UploadInfoContext";
import Image from "next/image";
import Link from "next/link";

export default function BookView({ response }: { response: BookInfo }) {
	const titleContext = useContext(HeaderTitleContext);
	const uploadInfoContext = useContext(UploadInfoContext);

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

		return () => {
			titleContext.setTitle(undefined);
			titleContext.setAuthor(undefined);
		};
	}, [titleContext, response, uploadInfoContext]);

	if (!response.success) {
		return (
			<div className="flex flex-col items-center text-center p-4 py-10 w-full h-full bg-paper text-mainTxt border border-accent/30 rounded-2xl space-y-5 font-lora">
				<Image
					className="block w-[min(100%,500px)]"
					width={1659}
					height={948}
					src="/dashboardAssets/bookNotFound.webp"
					alt=""
				/>
				<h1 className="text-mainTxt text-[2rem] tracking-[2px]">
					Nie udało się pobrać książki
				</h1>
				<p className="max-w-md text-mainTxt/60">
					Coś poszło nie tak podczas ładowania tej książki. Może to być
					chwilowy problem z połączeniem, albo książka jest obecnie
					niedostępna.
				</p>
				<Link
					href="/dashboard/home"
					className="flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-accent to-accentSecondary text-panel text-sm font-medium shadow-sm transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95">
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
		<div className="container mx-auto p-4 py-10 w-full h-full bg-paper text-mainTxt border border-accent/30 rounded-2xl space-y-5 font-lora">
			<div className="text-center pb-6 border-b border-accent/20">
				<h1 className="text-3xl sm:text-4xl font-semibold italic">{title}</h1>
				<div className="mx-auto mt-4 h-px w-12 bg-accent" />
				<p className="mt-4 text-xs sm:text-sm uppercase tracking-[0.25em] text-mainTxt/60">
					{author}
				</p>
			</div>
		</div>
	);
}
