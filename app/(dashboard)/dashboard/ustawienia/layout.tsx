"use client";
import { settingsLinks } from "@/lib/content";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function SettingsLayout({ children }: LayoutProps<"/">) {
	const pathname = usePathname();

	return (
		<div className="settings-container container mx-auto flex flex-col lg:flex-row gap-5 h-full">
			<nav className="w-[min(100%,250px)] shrink-0">
				<ul className="flex flex-col gap-1 grow">
					{settingsLinks.map((link) => {
						const isActive = pathname === link.href;
						return (
							<li key={link.href}>
								<Link
									href={link.href}
									className={`relative flex items-center gap-2 p-4 text-mainTxt transition-colors hover:bg-accent/5 rounded-lg ${isActive ? "bg-accent/10" : "bg-none"}`}>
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
										className="stroke-accent shrink-0 w-6"
										dangerouslySetInnerHTML={{ __html: link.icon }}
									/>
									{link.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
			<div className="settings-panel p-8 bg-panel w-full h-full scrollbar-accent rounded-lg border border-accent/20 overflow-y-auto">
				{children}
			</div>
		</div>
	);
}
