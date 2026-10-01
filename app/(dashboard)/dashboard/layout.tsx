"use client";
import { useRouter } from "next/navigation";
import DashboardAside from "@/components/DashboardAside";
import DashboardContent from "@/components/DashboardContent";
import { useState, useRef, useEffect, useMemo } from "react";
import { HeaderTitleContext } from "@/lib/headerTitleContext";
import { UserProfileContext } from "@/lib/UserProfileContext";
import { UploadInfoContext } from "@/lib/UploadInfoContext";
import { handleImportedFile } from "@/lib/uploadingFiles";
import type { UserData, ImportResult } from "@/lib/types";

export default function Layout({ children }: LayoutProps<"/">) {
	const [isAsideOpen, setIsAsideOpen] = useState(false);
	const [isDesktopAsideOpen, setIsDesktopAsideOpen] = useState(true);
	const [isDragging, setIsDragging] = useState(false);
	const importInputRef = useRef<HTMLInputElement>(null);
	const [isDropboxOpen, setisDropboxOpen] = useState(false);
	const [title, setTitle] = useState<string | undefined>(undefined);
	const [author, setAuthor] = useState<string | undefined>(undefined);

	const [isFileLoading, setIsFileLoading] = useState(false);
	const [uploadingFileInfo, setUploadingFileInfo] =
		useState<ImportResult | null>(null);

	const router = useRouter();

	const handleFileUpload = async (file: File | undefined) => {
		setIsFileLoading(true);

		const fileData = await handleImportedFile(file);

		if (fileData.success && fileData.id) {
			router.push(`/dashboard/czytam/${fileData.id}`);
		}

		setUploadingFileInfo(fileData);

		setIsFileLoading(false);
		setisDropboxOpen((p) => !p);
	};

	useEffect(() => {
		if (!uploadingFileInfo) return;

		const timeout = setTimeout(() => setUploadingFileInfo(null), 5000);

		return () => clearTimeout(timeout);
	}, [uploadingFileInfo]);

	const [userData, setUserData] = useState<UserData | null>(null);

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

		const file = files[0];

		handleFileUpload(file);

		setIsDragging(false);
	};
	useEffect(() => {
		const saved = localStorage.getItem("isDesktopAsideOpen");
		if (saved === null) return;
		setIsDesktopAsideOpen(saved === "true");
	}, []);

	const userProfileValue = useMemo(
		() => ({ userData, setUserData }),
		[userData],
	);
	const headerTitleValue = useMemo(
		() => ({ title, setTitle, author, setAuthor }),
		[title, author],
	);
	const uploadInfoValue = useMemo(() => ({ setUploadingFileInfo }), []);

	return (
		<UserProfileContext value={userProfileValue}>
			<HeaderTitleContext value={headerTitleValue}>
				<UploadInfoContext value={uploadInfoValue}>
					<div className="dashboard-content flex w-full h-full">
						<DashboardAside
							isDesktopAsideOpen={isDesktopAsideOpen}
							asideOpen={isAsideOpen}
						/>
						<div className="flex flex-col w-full h-full">
							<DashboardContent
								onDesktopAsideOpen={setIsDesktopAsideOpen}
								asideOpen={isAsideOpen}
								onAsideOpenAction={setIsAsideOpen}
								inputRefs={importInputRef}
								onDropboxOpen={setisDropboxOpen}
								handleFileUpload={handleFileUpload}
							/>
							<main className="relative flex-1 min-h-0 overflow-x-hidden overflow-y-auto px-4 py-5 sm:px-7 sm:pt-7 scrollbar-accent">
								{children}

								<div
									onDragEnter={dragenter}
									onDragOver={dragover}
									onDrop={drop}
									className={`dropbox ${isDropboxOpen ? "flex" : "hidden"} flex-col items-center w-[min(90%,480px)] p-10 rounded-2xl absolute left-1/2 top-1/2 -translate-1/2 bg-panel/95 backdrop-blur-sm text-center border-2 border-dashed shadow-lg transition-colors ${isDragging ? "border-accent bg-accent/5" : "border-accent/30"} z-100`}>
									<div
										className={`flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 transition-colors ${isDragging ? "bg-accent/20" : ""}`}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="28"
											height="28"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="text-accent">
											<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
											<polyline points="17 8 12 3 7 8"></polyline>
											<line x1="12" y1="3" x2="12" y2="15"></line>
										</svg>
									</div>

									<h3 className="mt-5 text-mainTxt text-lg font-semibold">
										Przeciągnij plik tutaj
									</h3>
									<p className="mt-1 text-mainTxt/60 text-sm">
										albo wybierz go ręcznie ze swojego urządzenia
									</p>

									<button
										disabled={isFileLoading}
										onClick={() => importInputRef.current?.click()}
										className="flex items-center gap-3 mt-6 px-6 py-3 rounded-full bg-linear-to-r from-accent to-accentSecondary text-panel text-sm font-medium shadow-sm cursor-pointer transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none">
										Wybierz plik
										{isFileLoading && (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												fill="none"
												viewBox="0 0 16 16"
												className="animate-spin">
												<path
													className="fill-panel"
													d="M9.25 1.5c0 .719-.563 1.25-1.25 1.25-.719 0-1.25-.531-1.25-1.25C6.75.812 7.281.25 8 .25c.688 0 1.25.563 1.25 1.25ZM8 13.25c.688 0 1.25.563 1.25 1.25 0 .719-.563 1.25-1.25 1.25-.719 0-1.25-.531-1.25-1.25 0-.688.531-1.25 1.25-1.25ZM15.75 8c0 .719-.563 1.25-1.25 1.25-.719 0-1.25-.531-1.25-1.25 0-.688.531-1.25 1.25-1.25.688 0 1.25.563 1.25 1.25Zm-13 0c0 .719-.563 1.25-1.25 1.25C.781 9.25.25 8.719.25 8c0-.688.531-1.25 1.25-1.25.688 0 1.25.563 1.25 1.25Zm.625-5.844c.719 0 1.25.563 1.25 1.25 0 .719-.531 1.25-1.25 1.25-.688 0-1.25-.531-1.25-1.25 0-.687.563-1.25 1.25-1.25Zm9.219 9.219c.687 0 1.25.531 1.25 1.25 0 .688-.563 1.25-1.25 1.25-.719 0-1.25-.563-1.25-1.25 0-.719.531-1.25 1.25-1.25Zm-9.219 0c.719 0 1.25.531 1.25 1.25 0 .688-.531 1.25-1.25 1.25-.688 0-1.25-.563-1.25-1.25 0-.719.563-1.25 1.25-1.25Z"
												/>
											</svg>
										)}
									</button>

									<p className="mt-4 text-mainTxt/40 text-xs uppercase tracking-wider">
										EPUB · PDF · MOBI
									</p>
								</div>
								<p
									className={`duration-300 fixed right-4 bottom-4 w-fit gap-3 ${uploadingFileInfo ? "translate-y-0 transition-transform duration-300 before:animate-[loadingBar_5s_infinite]" : "translate-y-125"} ${uploadingFileInfo?.success ? "bg-green-500/20 text-green-500 border-green-500/40 before:bg-green-500" : "bg-red-500/20 text-red-500 border-red-500/40 before:bg-red-500"} p-3 flex items-center border rounded-lg font-medium before:content-['']  before:h-px before:w-full before:absolute before:left-0 before:top-0 overflow-hidden`}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="feather feather-alert-circle w-4.5 shrink-0">
										<circle cx="12" cy="12" r="10"></circle>
										<line x1="12" y1="8" x2="12" y2="12"></line>
										<line x1="12" y1="16" x2="12.01" y2="16"></line>
									</svg>
									<span className="block grow text-center">
										{uploadingFileInfo?.message}
									</span>
								</p>
								<div
									onClick={() => setisDropboxOpen((p) => !p)}
									className={`dropbox-overlay ${isDropboxOpen ? "block" : "hidden"} fixed inset-0 bg-panel/50 z-10`}></div>
							</main>
						</div>
					</div>
				</UploadInfoContext>
			</HeaderTitleContext>
		</UserProfileContext>
	);
}
