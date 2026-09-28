"use client";
import type { BookData } from "@/lib/types";
import { UploadInfoContext } from "@/lib/UploadInfoContext";
import { useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function MyBooks({ bookData }: { bookData: BookData }) {
	const uploadInfoContext = useContext(UploadInfoContext);

	useEffect(() => {
		if (!bookData.success) {
			uploadInfoContext.setUploadingFileInfo(bookData);
			return;
		}
	}, [bookData, uploadInfoContext]);

	if (!bookData.success) return;

	if (bookData.books.length === 0) {
		return (
			<div className="flex flex-col items-center text-center gap-3 py-20 px-4 w-full bg-paper text-mainTxt border border-accent/30 rounded-2xl">
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
			{bookData.books.map(
				({
					title,
					id,
					author,
					cover_url,
					current_chapter_index,
					chapter_count,
				}) => {
					const progress =
						chapter_count > 0
							? Math.round(
									((current_chapter_index + 1) / chapter_count) * 100,
								)
							: 0;

					return (
						<li key={id}>
							<Link
								aria-label={`Link do książki ${title}`}
								href={`/dashboard/czytam/${id}`}
								className="group flex flex-col gap-2">
								<div className="relative aspect-2/3 w-full overflow-hidden rounded-lg border border-accent/20 bg-accent/10 shadow-sm transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
									{cover_url ? (
										<Image
											src={cover_url}
											fill
											sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
											alt={`Okładka książki ${title}`}
											className="object-cover"
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
						</li>
					);
				},
			)}
		</ul>
	);
}
