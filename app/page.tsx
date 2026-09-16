import Image from "next/image";
import Navigation from "@/components/Navigation";
import Header from "@/components/Hero";
import Books from "@/components/Books";

export default function Home() {
	return (
		<>
			<Navigation />
			<Header />
			<Books />
		</>
	);
}
