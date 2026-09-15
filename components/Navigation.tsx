"use client";
import Link from "next/link";
import Image from "next/image";
import { navigationContent } from "@/lib/content";
import { useEffect, useState } from "react";

export default function Navigation() {
	const [idx, setIdx] = useState(0);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setIsScrolled(window.scrollY > 100);
		onScroll();
		window.addEventListener("scroll", onScroll);

		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const changeActiveLink = (index: number) => {
		document.documentElement.style.setProperty("--index", String(index));
		setIdx(index);
	};

	return (
		<div
			className={`sticky max-w-400 mx-auto bg-white ${isScrolled ? "w-[min(100%,1000px)]" : "w-full"} ${isScrolled ? "rounded-[30px]" : "rounded-none"} ${isScrolled ? "top-8" : "top-0"} flex justify-center transition-[top,width,border-radius] duration-600`}>
			<nav className="w-full p-2 px-4 md:p-4 md:px-10 flex items-center">
				<Link
					href="/"
					aria-label="Logo strony Archetyp"
					className="flex items-center font-playfairDisplay">
					<Image
						src="/homePageAssets/book-bookmark-solid-full.svg"
						width={150}
						height={150}
						alt="Ikona książki z zakładką, która służy jako logo strony Archetyp"
						className="w-10"
					/>
					<span className="hidden sm:inline md:text-lg md:ml-2">Archetyp</span>
				</Link>
				<ul className="flex justify-center grow">
					{navigationContent.map((link, i) => {
						const isActive = idx === i;
						return (
							<li className="nav-item relative z-0" key={link.href}>
								<Link
									onClick={() => changeActiveLink(i)}
									className={`${isActive ? "text-white" : "text-accent"} text-sm sm:text-md lg:text-[1.1rem] block w-(--linkWidth) text-center transition-colors duration-800`}
									href={link.href}>
									{link.label}
								</Link>
							</li>
						);
					})}
				</ul>
				<button className="bg-accent text-white px-4 py-2 text-sm sm:text-md rounded-[5px] cursor-pointer border border-transparent transition-colors duration-300 hover:border-accent hover:bg-transparent hover:text-accent font-medium uppercase md:px-6 md:py-3">
					Czytaj
				</button>
			</nav>
		</div>
	);
}
