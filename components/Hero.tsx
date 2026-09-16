import { headerContent } from "@/lib/content";
import Image from "next/image";

export default function Header() {
	return (
		<header
			id="hero"
			className="relative flex items-center justify-center bg-[url('/homePageAssets/library-hero-img-desktop.webp')] bg-cover bg-center min-h-[80vh] lg:min-h-screen relative text-white before:content-[''] before:absolute before:inset-0 before:bg-black/50 before:-z-1 z-0">
			<div className="header-content flex flex-col justify-center items-center text-center px-3">
				<h1 className="header-title mt-10 font-playfairDisplay">
					<span className="block text-[clamp(1.875rem,calc(1rem+4vw),4.5rem)] text-shadow-lg">
						{headerContent.headerTitle}
					</span>
					<span className="block text-[clamp(1.875rem,calc(1rem+4vw),4.5rem)] text-shadow-lg">
						{headerContent.headerSubtitle}
					</span>
				</h1>
				<p className="description mt-3 mb-6 text-[clamp(1rem,calc(0.6rem+1vw),1.4rem)]">
					{headerContent.headerDescription}
				</p>
				<button className="bg-accent py-3 px-4 rounded-md cursor-pointer hover:bg-[#064c93] transition-colors md:text-xl">
					{headerContent.headerCta}
				</button>
			</div>
		</header>
	);
}
