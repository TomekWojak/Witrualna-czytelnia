import Image from "next/image";

export default function DashboardAside({ asideOpen }: { asideOpen: boolean }) {
	return (
		<>
			<aside
				className={`overscroll-contain col-start-1 col-end-2 w-70 ${asideOpen ? "translate-x-0" : "-translate-x-full"} bg-panel fixed inset-y-0 md:static md:translate-x-0 left-0 h-screen border-r border-accent/50 transition-transform duration-200 md:transition-none overflow-hidden z-50 shrink-0`}>
				<div className="aside-header p-2 flex items-center h-17 border-b border-accent/50">
					<Image
						width={150}
						height={150}
						src="/homePageAssets/book-bookmark-solid-full.svg"
						alt=""
						className="w-10"
					/>
					<span className="font-playfairDisplay text-lg">Archetyp</span>
				</div>
			</aside>
		</>
	);
}
