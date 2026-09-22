"use client";
import DashboardAside from "@/components/DashboardAside";
import DashboardContent from "@/components/DashboardContent";
import { useState, useRef } from "react";
import { HeaderTitleContext } from "@/lib/headerTitleContext";

export default function Layout({ children }: LayoutProps<"/">) {
	const [isAsideOpen, setIsAsideOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const importInputRef = useRef<HTMLInputElement>(null);
	const [isDropboxOpen, setisDropboxOpen] = useState(false);
	const [title, setTitle] = useState<string | undefined>(undefined);


	const dragenter = (e: React.DragEvent) => {
		e.stopPropagation();
		e.preventDefault();

		setIsDragging(true);
	};

	const dragover = (e: React.DragEvent) => {
		e.stopPropagation();
		e.preventDefault();
	};
	const drop = (e: React.DragEvent) => {
		e.stopPropagation();
		e.preventDefault();

		const dt = e.dataTransfer;
		const files = dt.files;

		setIsDragging(false);
	};

	return (
		<HeaderTitleContext value={{ title, setTitle }}>
			<div className="dashboard-content flex w-full h-full">
				<DashboardAside asideOpen={isAsideOpen} />
				<div className="flex flex-col w-full h-full">
					<DashboardContent
						asideOpen={isAsideOpen}
						onAsideOpenAction={setIsAsideOpen}
						inputRefs={importInputRef}
						onDropboxOpen={setisDropboxOpen}
					/>
					<main className="relative flex-1 min-h-0 overflow-x-hidden overflow-y-auto px-4 pb-20 pt-5 sm:px-7 sm:pt-7 scrollbar-accent">
						{children}
						<div
							onDragEnter={dragenter}
							onDragOver={dragover}
							onDrop={drop}
							className={`dropbox ${isDropboxOpen ? "block" : "hidden"} w-[min(85%,400px)] p-2 py-12 rounded-lg absolute left-1/2 top-1/2 -translate-1/2 ${isDragging ? "bg-main/80" : "bg-main/40"} text-center border border-dashed ${isDragging ? "border-accent/70" : "border-accent/40"} text-panel transition-colors`}>
							<button
								onClick={() => importInputRef.current?.click()}
								className="px-3 py-2 bg-accent/95 rounded-md cursor-pointer text-sm">
								Wybierz plik
							</button>
							<p className="text-mainTxt/70 mt-4 text-sm">
								Wybierz lub przeciągnij plik
							</p>
						</div>
					</main>
				</div>
			</div>
		</HeaderTitleContext>
	);
}
