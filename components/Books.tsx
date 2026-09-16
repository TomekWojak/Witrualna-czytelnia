"use client";
import { booksContent, books } from "@/lib/content";
import { useState } from "react";
import Image from "next/image";

export default function Books() {
	const [index, setIndex] = useState(0);

	const showNextPage = () => {
		if (index >= books.length - 1) return;

		setIndex((p) => p + 1);
	};
	const showPrevPage = () => {
		if (index <= 0) return;

		setIndex((p) => p - 1);
	};

	return (
		<section className="p-2 py-10 bg-[#fffdfd] sm:py-15 md:py-20">
			<div className="books-content container mx-auto">
				<h2 className="text-center text-accent text-[clamp(1rem,calc(1rem+1vw),2rem)] uppercase font-medium">
					{booksContent.booksTitle}
				</h2>
				<ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-10">
					{books[index].map((book) => (
						<li className="flex flex-col" key={book.isbn}>
							<div className="relative w-full h-50 bg-[#8a8282] flex items-center justify-center">
								<span className="absolute flex gap-1 text-xs items-center bottom-2 right-2">
									{book.estimatedReadingTime}
									<Image
										src="/homePageAssets/clock-solid-full.svg"
										width={150}
										height={150}
										alt=""
										className="w-5"
									/>
								</span>
								Image
							</div>
							<div className="body flex flex-col h-full p-2 text-sm text-accent space-y-2">
								<p>
									<span className="font-semibold">Tytuł:</span> {book.title}
								</p>
								<p>
									<span className="font-semibold">Autor: </span>
									{book.author}
								</p>
								<p className="description mb-5">
									{book.description.slice(0, 50) + "..."}
								</p>
								<button className="w-full mt-auto bg-accent text-white px-6 py-3 uppercase font-medium cursor-pointer rounded-md border border-transparent hover:bg-transparent hover:border-accent hover:text-accent transition-colors duration-300">
									Czytaj
								</button>
								<div className="flex items-center mt-5 justify-between gap-2">
									<span className="flex items-center gap-1 font-semibold">
										<Image
											width={150}
											height={150}
											alt=""
											src="/homePageAssets/book-open-solid-full.svg"
											className="w-5"
										/>
										{book.pages}
									</span>
									<span className="flex items-center gap-1 font-semibold">
										{book.rating}
										<Image
											src="/homePageAssets/ranking-star-solid-full.svg"
											width={150}
											height={150}
											alt=""
											className="w-5"
										/>
									</span>
								</div>
							</div>
						</li>
					))}
				</ul>
				<div className="controls flex flex-wrap justify-center items-center gap-5 mt-10 md:mt-15 lg:mt-20 sm:flex-nowrap">
					<button
						onClick={showPrevPage}
						className="prev p-2 bg-accent text-white rounded-md order-1 cursor-pointer grow sm:grow-0 sm:order-0 border border-transparent hover:text-accent hover:bg-transparent hover:border-accent transition-colors duration-300">
						Poprzednia
					</button>
					<ul className="tiles flex justify-center gap-1 w-full sm:w-fit">
						{books.map((book, i) => {
							const isActive = index === i;
							return (
								<li key={book[i].id}>
									<button
										onClick={() => setIndex(i)}
										className={`w-8 aspect-square rounded-sm cursor-pointer border ${isActive ? "border-accent" : "border-transparent"} ${isActive ? "bg-transparent" : "bg-accent"} ${isActive ? "text-accent" : "text-white"} transition-colors duration-300 hover:opacity-90`}>
										{String(i + 1)}
									</button>
								</li>
							);
						})}
					</ul>
					<button
						onClick={showNextPage}
						className="prev p-2 bg-accent text-white rounded-md cursor-pointer grow sm:grow-0 border border-transparent hover:text-accent hover:bg-transparent hover:border-accent transition-colors duration-300">
						Następna
					</button>
				</div>
			</div>
		</section>
	);
}
