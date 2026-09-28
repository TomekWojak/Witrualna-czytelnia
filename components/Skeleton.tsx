export function AsidePanelUserDataSkeleton() {
	return (
		<>
			<div className="relative overflow-hidden flex items-center justify-center w-7 h-7 rounded-full bg-accent/20 shrink-0">
				<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_alternate] bg-linear-to-r from-transparent via-white/30 to-transparent" />
			</div>

			<span className="relative overflow-hidden ml-2 w-full h-5 bg-accent/20 rounded-md">
				<span className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_alternate] bg-linear-to-r from-transparent via-white/30 to-transparent" />
			</span>

			<span className="relative overflow-hidden ml-2 w-11 h-6 bg-accent/20 rounded-full shrink-0">
				<span className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_alternate] bg-linear-to-r from-transparent via-white/30 to-transparent" />
			</span>
		</>
	);
}

const bookSkeletonParagraphLineWidths = [
	"w-full",
	"w-full",
	"w-5/6",
	"w-full",
	"w-full",
	"w-3/4",
];

export function BookViewSkeleton() {
	return (
		<>
			<div className="text-center pb-6 border-b border-accent/20">
				<div className="relative overflow-hidden mx-auto w-2/3 max-w-xs h-9 bg-accent/20 rounded-md">
					<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_alternate] bg-linear-to-r from-transparent via-white/30 to-transparent" />
				</div>

				<div className="mx-auto mt-4 h-px w-12 bg-accent" />

				<div className="relative overflow-hidden mx-auto mt-4 w-1/3 max-w-32 h-4 bg-accent/20 rounded-md">
					<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_alternate] bg-linear-to-r from-transparent via-white/30 to-transparent" />
				</div>
			</div>

			{Array.from({ length: 2 }).map((_, paragraphIndex) => (
				<div key={paragraphIndex} className="mt-6 space-y-3">
					{bookSkeletonParagraphLineWidths.map((width, lineIndex) => (
						<div
							key={lineIndex}
							className={`relative overflow-hidden ${width} h-4 bg-accent/20 rounded-md`}>
							<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_alternate] bg-linear-to-r from-transparent via-white/30 to-transparent" />
						</div>
					))}
				</div>
			))}
		</>
	);
}

export function MyBooksSkeleton() {
	return (
		<ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
			{Array.from({ length: 10 }).map((_, i) => (
				<li key={i} className="flex flex-col gap-2">
					<div className="relative overflow-hidden aspect-2/3 w-full rounded-lg bg-accent/20">
						<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_alternate] bg-linear-to-r from-transparent via-white/30 to-transparent" />
					</div>
					<div className="relative overflow-hidden w-4/5 h-4 bg-accent/20 rounded-md">
						<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_alternate] bg-linear-to-r from-transparent via-white/30 to-transparent" />
					</div>
					<div className="relative overflow-hidden w-1/2 h-3 bg-accent/20 rounded-md">
						<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_alternate] bg-linear-to-r from-transparent via-white/30 to-transparent" />
					</div>
				</li>
			))}
		</ul>
	);
}
