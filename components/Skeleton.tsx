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
