import { BookViewSkeleton } from "@/components/Skeleton";
export default function Loading() {
	return (
		<div className="p-4 w-full h-full bg-paper text-mainTxt border border-accent/30 rounded-2xl space-y-5">
			<BookViewSkeleton />
		</div>
	);
}
