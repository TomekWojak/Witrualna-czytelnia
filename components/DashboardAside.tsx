import { asideLinksMain, asideLinks } from "@/lib/content";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { changeTheme, themes, getThemeIndex } from "@/lib/themes";
import { getActiveLink } from "@/lib/getActiveLinkFromPathname";
import { supabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { AsidePanelUserDataSkeleton } from "./Skeleton";
import Image from "next/image";

type UserData = {
	name: string;
	avatar_url: string;
	plan: string;
};

export default function DashboardAside({ asideOpen }: { asideOpen: boolean }) {
	const [activeThemeIndex, setActiveThemeIndex] = useState(0);
	const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);
	const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [userData, setUserData] = useState<UserData | null>(null);

	const router = useRouter();

	async function logOutUser() {
		try {
			setIsLoading(true);
			await supabaseClient.auth.signOut();

			router.push("/logowanie");
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		const getData = async () => {
			const {
				data: { user },
			} = await supabaseClient.auth.getUser();

			if (!user) {
				throw new Error("Wystąpił problem z identyfikacją użytkownika");
			}

			const { data, error } = await supabaseClient
				.from("profiles")
				.select("name, avatar_url, plan")
				.eq("id", user.id)
				.single();

			if (!data) {
				console.error(error);
				return;
			}

			setUserData((prev) => ({
				...prev,
				name: data?.name,
				avatar_url: data?.avatar_url,
				plan: data?.plan[0].toUpperCase() + data?.plan.slice(1),
			}));
		};

		getData();
	}, []);

	const pathname = usePathname();
	useEffect(() => {
		const savedThemeIndex = getThemeIndex();
		if (savedThemeIndex === undefined || savedThemeIndex === -1) return;

		setActiveThemeIndex(savedThemeIndex);
	}, []);

	return (
		<>
			<aside
				className={`flex flex-col overscroll-contain col-start-1 col-end-2 w-70 h-dvh ${asideOpen ? "translate-x-0" : "-translate-x-full"} bg-linear-to-b from-panel to-main fixed inset-y-0 md:static md:translate-x-0 left-0 border-r border-accent/20 transition-transform duration-200 md:transition-none z-50 shrink-0`}>
				<div className="aside-header overflow-hidden p-4 flex items-center h-17 border-b border-accent/20">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 640 640"
						fill="currentColor"
						className="w-8 fill-accent">
						<path d="M192 576L512 576C529.7 576 544 561.7 544 544C544 526.3 529.7 512 512 512L512 445.3C530.6 438.7 544 420.9 544 400L544 112C544 85.5 522.5 64 496 64L448 64L448 233.4C448 245.9 437.9 256 425.4 256C419.4 256 413.6 253.6 409.4 249.4L368 208L326.6 249.4C322.4 253.6 316.6 256 310.6 256C298.1 256 288 245.9 288 233.4L288 64L192 64C139 64 96 107 96 160L96 480C96 533 139 576 192 576zM160 480C160 462.3 174.3 448 192 448L448 448L448 512L192 512C174.3 512 160 497.7 160 480z" />
					</svg>
					<span className="font-playfairDisplay text-lg text-mainTxt ml-2">
						Archetyp
					</span>
				</div>
				<nav>
					<span className="uppercase block p-4 pt-6 pb-2 font-medium tracking-widest text-xs text-accent">
						Główne
					</span>
					<ul className="p-2">
						{asideLinksMain.map((link) => {
							const isActive = getActiveLink(pathname)?.href === link.href;
							return (
								<li key={link.href}>
									<Link
										className={`relative flex items-center gap-2 p-2.5 pl-4 text-mainTxt transition-colors hover:bg-accent/5 ${isActive ? "bg-accent/5" : "bg-none"} rounded-lg`}
										href={link.href}>
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
											className="stroke-accent shrink-0 w-4"
											dangerouslySetInnerHTML={{ __html: link.icon }}
										/>
										{link.label}
										<span
											className={`${isActive ? "scale-100" : "scale-0"} absolute left-0 w-1 h-full bg-accent transition-transform origin-center duration-300 rounded-tl-lg rounded-bl-lg`}></span>
									</Link>
								</li>
							);
						})}
					</ul>
					<span className="uppercase block p-4 pt-6 pb-2 font-medium tracking-widest text-xs text-accent">
						Panel
					</span>
					<ul className="p-2">
						{asideLinks.map((link) => {
							const isActive = pathname === link.href;
							return (
								<li key={link.href}>
									<Link
										className={`relative flex items-center gap-2 p-2.5 pl-4 text-mainTxt transition-colors hover:bg-accent/5 ${isActive ? "bg-accent/5" : "bg-none"} rounded-lg`}
										href={link.href}>
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
											className="stroke-accent shrink-0 w-4"
											dangerouslySetInnerHTML={{ __html: link.icon }}
										/>
										{link.label}
										<span
											className={`${isActive ? "scale-100" : "scale-0"} absolute left-0 w-1 h-full bg-accent transition-transform origin-center duration-300 rounded-tl-lg rounded-bl-lg`}></span>
									</Link>
								</li>
							);
						})}
						<li className="relative text-mainTxt">
							<button
								onClick={() => setIsThemePanelOpen((p) => !p)}
								aria-expanded={isThemePanelOpen}
								className="w-full flex items-center gap-2 p-2.5 pl-4  transition-colors hover:bg-accent/5 rounded-lg cursor-pointer">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="24px"
									viewBox="0 -960 960 960"
									width="24px"
									fill="#e3e3e3"
									className="fill-accent w-5">
									<path d="M324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM520-163q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z" />
								</svg>
								Motyw
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
									className={`feather feather-chevron-right stroke-accent w-5 ml-auto transition-transform duration-300 md:rotate-0 ${isThemePanelOpen ? "-rotate-90" : "rotate-90"}`}>
									<polyline points="9 18 15 12 9 6"></polyline>
								</svg>
							</button>

							<div
								className={`grid md:hidden transition-[grid-template-rows] duration-300 ease-in-out ${isThemePanelOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
								<ul className="overflow-y-auto scrollbar-accent max-h-60 pl-2">
									{themes.map((theme, i) => {
										const isActiveTheme = activeThemeIndex === i;
										return (
											<li
												key={theme.name}
												title={theme.name}
												onClick={() => {
													changeTheme(theme);
													setActiveThemeIndex(i);
													setIsThemePanelOpen(false);
												}}
												className={`group cursor-pointer p-2 text-left flex items-center justify-between hover:bg-accent/5 rounded-lg transition-colors ${isActiveTheme ? "bg-accent/5" : "bg-none"}`}>
												<span>{theme.name}</span>
												<div className="group-hover:bg-mainTxt/10 p-2 rounded-md transition-colors">
													<span
														className="block w-3 h-3 rounded-full"
														style={{
															background: `linear-gradient(90deg, ${theme["--main-color"]} 50%, ${theme["--accent"]} 50%)`,
														}}></span>
												</div>
											</li>
										);
									})}
								</ul>
							</div>

							<ul
								className={`hidden ${isThemePanelOpen ? "md:block" : "md:hidden"} md:absolute md:top-1/2 md:-translate-y-1/2 md:-right-3 md:translate-x-full  bg-panel md:w-60 rounded-md md:border border-accent/20 md:p-3`}>
								{themes.map((theme, i) => {
									const isActiveTheme = activeThemeIndex === i;
									return (
										<li
											key={theme.name}
											title={theme.name}
											onClick={() => {
												changeTheme(theme);
												setActiveThemeIndex(i);
												setIsThemePanelOpen(false);
											}}
											className={`group cursor-pointer p-2 text-left flex items-center justify-between hover:bg-accent/5 rounded-lg transition-colors ${isActiveTheme ? "bg-accent/5" : "bg-none"}`}>
											<span>{theme.name}</span>
											<div className="group-hover:bg-mainTxt/10 p-2 rounded-md transition-colors">
												<span
													className="block w-3 h-3 rounded-full"
													style={{
														background: `linear-gradient(90deg, ${theme["--main-color"]} 50%, ${theme["--accent"]} 50%)`,
													}}></span>
											</div>
										</li>
									);
								})}
							</ul>
						</li>
					</ul>
				</nav>
				<div className="relative aside-acount-details flex items-center p-4 border-t border-accent/10 mt-auto">
					{userData ? (
						<>
							<button
								onClick={() => setIsUserPanelOpen((p) => !p)}
								className="flex items-center justify-center w-7 h-7 rounded-full bg-linear-to-br from-accent to-accentSecondary text-xs cursor-pointer text-panel">
								{userData.avatar_url ? (
									<Image
										src={userData.avatar_url}
										width={28}
										height={28}
										alt="Avatar użytkownika"
									/>
								) : (
									userData.name && userData.name[0]
								)}
							</button>
							<span className="text-mainTxt ml-2">
								{userData.name || "Username"}
							</span>
							<span className="px-2 py-1 ml-auto border border-accent/40 text-xs font-medium bg-linear-to-r from-accent/15 to-accentSecondary/20 text-accent rounded-full">
								{userData.plan}
							</span>
							<ul
								className={`${isUserPanelOpen ? "flex" : "hidden"} absolute bg-panel p-2 rounded-md left-4 top-2 -translate-y-full min-w-60 flex-col text-xs text-mainTxt gap-2`}>
								<li className="w-full">
									<button
										onClick={logOutUser}
										className="p-2 flex items-center justify-between hover:bg-accent/5 w-full text-left rounded-md">
										Wyloguj się
										{isLoading && (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												fill="none"
												className="w-3 animate-spin stroke-accent"
												viewBox="0 0 16 16">
												<path
													fill="#fff"
													d="M9.25 1.5c0 .719-.563 1.25-1.25 1.25-.719 0-1.25-.531-1.25-1.25C6.75.812 7.281.25 8 .25c.688 0 1.25.563 1.25 1.25ZM8 13.25c.688 0 1.25.563 1.25 1.25 0 .719-.563 1.25-1.25 1.25-.719 0-1.25-.531-1.25-1.25 0-.688.531-1.25 1.25-1.25ZM15.75 8c0 .719-.563 1.25-1.25 1.25-.719 0-1.25-.531-1.25-1.25 0-.688.531-1.25 1.25-1.25.688 0 1.25.563 1.25 1.25Zm-13 0c0 .719-.563 1.25-1.25 1.25C.781 9.25.25 8.719.25 8c0-.688.531-1.25 1.25-1.25.688 0 1.25.563 1.25 1.25Zm.625-5.844c.719 0 1.25.563 1.25 1.25 0 .719-.531 1.25-1.25 1.25-.688 0-1.25-.531-1.25-1.25 0-.687.563-1.25 1.25-1.25Zm9.219 9.219c.687 0 1.25.531 1.25 1.25 0 .688-.563 1.25-1.25 1.25-.719 0-1.25-.563-1.25-1.25 0-.719.531-1.25 1.25-1.25Zm-9.219 0c.719 0 1.25.531 1.25 1.25 0 .688-.531 1.25-1.25 1.25-.688 0-1.25-.563-1.25-1.25 0-.719.563-1.25 1.25-1.25Z"
												/>
											</svg>
										)}
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
											className={`${isLoading ? "hidden" : "block"} feather stroke-accent feather-log-out w-3`}>
											<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
											<polyline points="16 17 21 12 16 7"></polyline>
											<line x1="21" y1="12" x2="9" y2="12"></line>
										</svg>
									</button>
								</li>
							</ul>
						</>
					) : (
						<AsidePanelUserDataSkeleton />
					)}
				</div>
			</aside>
		</>
	);
}
