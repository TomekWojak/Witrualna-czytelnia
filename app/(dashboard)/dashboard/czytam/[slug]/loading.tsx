import { BookViewSkeleton } from "@/components/Skeleton";
export default function Loading() {
	return (
		<div className="p-4 w-full h-full text-mainTxt space-y-5">
			<BookViewSkeleton />
		</div>
	);
}
