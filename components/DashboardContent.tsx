import type { frameProps } from "@/lib/types";

import { usePathname } from "next/navigation";
import { getActiveLink } from "@/lib/getActiveLinkFromPathname";
import { useContext } from "react";
import { HeaderTitleContext } from "@/lib/headerTitleContext";

export default function DashboardContent({
	asideOpen,
	onAsideOpenAction,
	desktopAsideOpen,
	onDesktopAsideOpen,
	inputRefs,
	onDropboxOpen,
	handleFileUpload,
}: frameProps) {
	const pathname = usePathname();
	const titleContext = useContext(HeaderTitleContext);

	const handleDesktopNav = () => {
		onDesktopAsideOpen((prev) => {
			localStorage.setItem("isDesktopAsideOpen", String(!prev));

			return !prev;
		});
	};

	return (
		<div className="relative dashboard-main w-full flex flex-col">
			<header
				className={`flex px-6 items-center justify-between sticky top-0 bg-linear-to-r from-panel to-main h-17 border-b border-accent/20 transition-[grid-column] duration-500 z-30`}>
				<div className="header-left flex items-center gap-2">
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
					<button
						onClick={handleDesktopNav}
						className="hidden md:block ml-auto py-1.5 px-2 rounded-md transition-colors hover:bg-accent/5">
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
							className="feather feather-sidebar stroke-accent w-5">
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
							<line x1="9" y1="3" x2="9" y2="21"></line>
						</svg>
					</button>
					<span className="text-mainTxt flex items-center gap-2 min-w-0">
						<span
							className={`truncate max-w-50 sm:max-w-none ${
								desktopAsideOpen
									? "md:max-w-70 lg:max-w-none"
									: "md:max-w-none lg:max-w-none"
							}`}
							title={titleContext.title ?? undefined}>
							{titleContext.title ?? getActiveLink(pathname)?.label}
						</span>
						{titleContext.author && (
							<>
								<div className="ml-2 w-px h-6 bg-accent/30 shrink-0 hidden lg:block fill-accent mx-2" />

								<span className="hidden lg:inline">{titleContext.author}</span>
							</>
						)}
					</span>
				</div>
				<div className="header-right flex items-center gap-6">
					<button
						onClick={() => onDropboxOpen((p) => !p)}
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
						ref={inputRefs}
						onChange={(e) => {
							const file = e.target.files?.[0];
							e.target.value = "";
							handleFileUpload(file);
						}}
						type="file"
						accept=".epub,.pdf,.mobi"
						className="hidden"
					/>
				</div>
			</header>

			<div
				onClick={() => onAsideOpenAction((p) => !p)}
				className={`overlay ${asideOpen ? "block" : "hidden"} fixed inset-0 bg-black/30 z-20 md:hidden`}></div>
		</div>
	);
}
