"use client";
import Link from "next/link";
import Image from "next/image";
import { navigationContent } from "@/lib/content";
import { useEffect, useState } from "react";

export default function Navigation() {
	const [idx, setIdx] = useState(0);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isNavMobileOpen, setIsNavMobileOpen] = useState(false);

	useEffect(() => {
		const onScroll = () =>
			setIsScrolled(window.scrollY > 100 && window.innerWidth >= 640);
		onScroll();
		window.addEventListener("scroll", onScroll);

		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const changeActiveLink = (index: number) => {
		document.documentElement.style.setProperty("--index", String(index));
		setIdx(index);
	};

	const handleMobileNav = () => {
		setIsNavMobileOpen((p) => !p);
	};

	return (
		<div
			className={`fixed left-1/2 -translate-x-1/2 bg-white ${isScrolled ? "w-[min(100%,1000px)]" : "w-full"} ${isScrolled ? "rounded-[30px]" : "rounded-none"} ${isScrolled ? "top-8" : "top-0"} flex justify-center transition-[top,width,border-radius] duration-600 z-1000 shadow-sm border border-accent/30`}>
			<nav className="max-w-400 w-full p-2 px-4 md:p-4 md:px-10 flex items-center justify-between sm:justify-normal">
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
				<ul className="hidden sm:flex justify-center w-full grow">
					{navigationContent.map((link, i) => {
						const isActive = idx === i;
						return (
							<li className="nav-item relative z-0" key={link.href}>
								<Link
									onClick={() => changeActiveLink(i)}
									className={`${isActive ? "text-white" : "text-accent"} text-sm sm:text-md lg:text-[1.1rem] block w-(--linkWidth) text-center transition-colors duration-800 hover:opacity-90`}
									href={link.href}>
									{link.label}
								</Link>
							</li>
						);
					})}
				</ul>
				<button className="hidden sm:block cursor-pointer p-2 rounded-full hover:bg-[#f1f1f1] transition-colors duration-300">
					<Image
						className="w-6"
						src="/homePageAssets/user-regular-full.svg"
						width={150}
						height={150}
						alt=""
					/>
				</button>
				<div
					className={`nav-mobile fixed inset-0 w-screen h-screen sm:hidden bg-white z-500 transition-transform duration-600 delay-200 ${isNavMobileOpen ? "translate-x-0" : "translate-x-[150%]"}`}>
					<ul className="flex w-full h-full flex-col gap-10 items-center justify-center text-accent">
						{navigationContent.map((link) => (
							<li key={link.href}>
								<a className="text-[1.6rem]" href={link.href}>
									{link.label}
								</a>
							</li>
						))}
						<li>
							<button className="cursor-pointer p-2 rounded-full">
								<Image
									className="w-6"
									src="/homePageAssets/user-regular-full.svg"
									width={150}
									height={150}
									alt=""
								/>
							</button>
						</li>
					</ul>
					<button
						onClick={handleMobileNav}
						className="absolute right-10 top-10 cursor-pointer">
						<Image
							className="w-8"
							src="/homePageAssets/x.svg"
							width={24}
							height={24}
							alt=""
						/>
					</button>
				</div>
				<button
					onClick={handleMobileNav}
					className="relative mobile-btn w-8 h-8 cursor-pointer sm:hidden">
					<span
						className={`line line-top absolute top-2 left-0 rounded-md bg-accent ${isNavMobileOpen ? "w-full" : "w-1/2"} h-0.75 transition-[width] duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]`}></span>
					<span className="line line-middle absolute top-4 left-0 rounded-md bg-accent w-full h-0.75"></span>
					<span
						className={`line line-bottom absolute top-6 right-0 rounded-md bg-accent ${isNavMobileOpen ? "w-full" : "w-1/2"} h-0.75 transition-[width] duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]`}></span>
				</button>
			</nav>
		</div>
	);
}
