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

function ShimmerBlock({ className }: { className: string }) {
	return (
		<div className={`relative overflow-hidden bg-accent/20 ${className}`}>
			<div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_alternate] bg-linear-to-r from-transparent via-white/30 to-transparent" />
		</div>
	);
}

export function NotesSkeleton() {
	return (
		<div className="container mx-auto space-y-8 text-mainTxt font-lora">
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
				<div>
					<h1 className="font-playfairDisplay text-3xl sm:text-4xl">
						Twoje notatki
					</h1>
					<div className="mt-3 h-1 w-16 bg-accent rounded-full" />
				</div>
				<ShimmerBlock className="w-full sm:w-72 h-9 rounded-full" />
			</div>

			{Array.from({ length: 2 }).map((_, groupIndex) => (
				<section
					key={groupIndex}
					className="bg-panel/60 border border-accent/20 rounded-2xl p-5 sm:p-6">
					<div className="flex flex-col sm:flex-row sm:items-center gap-3 pb-4 mb-5 border-b border-accent/20">
						<div className="flex flex-col gap-2 w-full max-w-xs">
							<ShimmerBlock className="w-3/4 h-7 rounded-md" />
							<ShimmerBlock className="w-1/2 h-4 rounded-md" />
						</div>
						<ShimmerBlock className="sm:ml-auto w-10 h-6 rounded-full shrink-0" />
						<ShimmerBlock className="w-28 h-5 rounded-md shrink-0" />
					</div>

					<ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{Array.from({ length: 3 }).map((_, noteIndex) => (
							<li
								key={noteIndex}
								className="flex flex-col gap-2 bg-main rounded-xl p-4 border border-accent/10">
								<ShimmerBlock className="w-20 h-5 rounded-md" />
								<ShimmerBlock className="w-2/3 h-6 rounded-md" />
								<ShimmerBlock className="w-full h-3.5 rounded-md mt-1" />
								<ShimmerBlock className="w-full h-3.5 rounded-md" />
								<ShimmerBlock className="w-4/5 h-3.5 rounded-md" />
							</li>
						))}
					</ul>
				</section>
			))}
		</div>
	);
}

export function DashboardHomeSkeleton() {
	return (
		<div className="space-y-6 container mx-auto">
			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
				<div className="w-full max-w-md">
					<ShimmerBlock className="w-3/4 h-9 sm:h-10 rounded-md" />
					<div className="mt-3 h-1 w-16 bg-accent rounded-full" />
					<ShimmerBlock className="mt-4 w-2/3 h-4 rounded-md" />
				</div>
				<div className="flex flex-col gap-2 w-full max-w-xs shrink-0">
					<ShimmerBlock className="w-full h-4 rounded-md" />
					<ShimmerBlock className="w-4/5 h-4 rounded-md" />
					<ShimmerBlock className="w-1/3 h-3 rounded-md" />
				</div>
			</div>

			<div className="bg-panel/60 border border-accent/20 rounded-2xl p-5 sm:p-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:pr-20">
				<div className="flex flex-col sm:flex-row gap-8 items-center xl:w-full">
					<ShimmerBlock className="w-28 aspect-2/3 rounded-lg shrink-0" />
					<div className="flex flex-col flex-1 w-full gap-2 items-center sm:items-start">
						<ShimmerBlock className="w-32 h-3 rounded-md" />
						<ShimmerBlock className="w-2/3 h-7 rounded-md" />
						<ShimmerBlock className="w-1/3 h-4 rounded-md" />
						<ShimmerBlock className="mt-4 w-full h-2 rounded-full" />
						<ShimmerBlock className="mt-4 w-36 h-10 rounded-full" />
					</div>
				</div>
				<div className="hidden lg:block w-px bg-accent/20 self-stretch" />
				<div className="flex flex-col gap-2 xl:w-100 xl:ml-5">
					<ShimmerBlock className="w-full h-3.5 rounded-md" />
					<ShimmerBlock className="w-full h-3.5 rounded-md" />
					<ShimmerBlock className="w-3/4 h-3.5 rounded-md" />
					<ShimmerBlock className="mt-1 w-20 h-6 rounded-full" />
				</div>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
				<div className="bg-panel/60 border border-accent/20 rounded-2xl p-5">
					<ShimmerBlock className="w-44 h-6 rounded-md mb-5" />
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
						{Array.from({ length: 2 }).map((_, i) => (
							<div
								key={i}
								className="bg-main p-4 rounded-xl flex items-start gap-4">
								<ShimmerBlock className="w-6 h-6 mt-2 rounded-md shrink-0" />
								<div className="flex flex-col gap-2 w-full">
									<ShimmerBlock className="w-12 h-8 rounded-md" />
									<ShimmerBlock className="w-3/4 h-4 rounded-md" />
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="bg-panel/60 border border-accent/20 rounded-2xl p-5">
					<div className="flex items-center justify-between mb-5">
						<ShimmerBlock className="w-40 h-6 rounded-md" />
						<ShimmerBlock className="w-28 h-4 rounded-md" />
					</div>
					<ul>
						{Array.from({ length: 4 }).map((_, i) => (
							<li
								key={i}
								className="flex items-center gap-4 py-3 border-b border-accent/10 last:border-b-0">
								<ShimmerBlock className="w-10 aspect-2/3 rounded-md shrink-0" />
								<div className="flex flex-col gap-2 flex-1">
									<ShimmerBlock className="w-2/3 h-4 rounded-md" />
									<ShimmerBlock className="w-1/3 h-3 rounded-md" />
								</div>
								<ShimmerBlock className="w-20 h-3 rounded-md shrink-0" />
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

export function QuizQuestionsSkeleton() {
	return (
		<ul
			aria-busy="true"
			aria-label="Przygotowuję pytania"
			className="flex flex-col gap-5 p-5 sm:p-6 overflow-y-auto scrollbar-accent">
			{Array.from({ length: 3 }).map((_, i) => (
				<li key={i} className="flex flex-col gap-2">
					<div className="flex items-start gap-3 mb-2">
						<ShimmerBlock className="w-6 h-6 rounded-full shrink-0" />
						<div className="flex flex-col gap-2 w-full">
							<ShimmerBlock className="w-full h-4 rounded-md" />
							<ShimmerBlock className="w-2/3 h-4 rounded-md" />
						</div>
					</div>
					<ShimmerBlock className="w-full h-20 rounded-lg" />
				</li>
			))}
		</ul>
	);
}
