import type { asideProps } from "@/lib/types";

export default function DashboardHeader({
	asideOpen,
	onAsideOpen,
}: asideProps) {
	return (
		<div className="relative dashboard-main w-full h-full flex flex-col">
			<header
				className={`sticky top-0 bg-panel h-17 border-b border-accent/50 transition-[grid-column] duration-500 z-30`}>
				<button
					onClick={() => onAsideOpen((p) => !p)}
					className={`absolute top-1/2 md:hidden -translate-y-1/2 left-2 manage-sidebar-btn w-6 h-6 cursor-pointer`}>
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
			</header>
			<main className="relative flex-1 min-h-0 overflow-x-hidden overflow-y-auto px-4 pb-20 pt-5 sm:px-7 sm:pt-7">
				<div className="container mx-auto"></div>
			</main>
			<div
				onClick={() => onAsideOpen((p) => !p)}
				className={`overlay ${asideOpen ? "block" : "hidden"} fixed inset-0 bg-black/30 z-20 md:hidden`}></div>
		</div>
	);
}
