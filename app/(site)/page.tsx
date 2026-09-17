import Image from "next/image";
import Navigation from "@/components/Navigation";
import Header from "@/components/Hero";
import Books from "@/components/Books";
import About from "@/components/About";

export default function Home() {
	return (
		<>
			<Navigation />
			<Header />
			<main>
				<Books />
				<About />
			</main>
		</>
	);
}
