"use client";
import { useContext, useEffect, useState } from "react";
import { UploadInfoContext } from "@/lib/UploadInfoContext";
import { getChapterToAnalysis } from "@/lib/getChapterToAnalysis";
import { htmlToText } from "@/lib/htmlToText";
import { handleQuiz } from "@/lib/api/quizInteraction";
import type { QuizQuestion } from "@/lib/types";
import { QuizQuestionsSkeleton } from "@/components/Skeleton";

type FormState = "questions" | "reflection" | "done";

const waitingSentences = [
	"Analizowanie rozdziału",
	"Czy na pewno wszystko pamiętasz?",
	"Przewracam kartki",
	"Szukam tego, co najważniejsze",
	"Zaglądam bohaterom do głowy",
	"Czytam między wierszami",
	"Ostrzę ołówek",
];

export default function ChapterQuiz({
	onClose,
	bookId,
	chapterIndex,
}: {
	onClose: React.Dispatch<React.SetStateAction<boolean>>;
	bookId: string;
	chapterIndex: number;
}) {
	const [formState, setFormState] = useState<FormState>("questions");
	const [answers, setAnswers] = useState<Record<number, string>>({});
	const [questions, setQuestions] = useState<QuizQuestion[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [sentenceIndex, setSentenceIndex] = useState(0);
	const [charactersCount, setCharactersCount] = useState(0);
	const [reflectionValue, setReflectionValue] = useState("");

	const uploadInfoContext = useContext(UploadInfoContext);

	useEffect(() => {
		const launchModel = async () => {
			try {
				const response = await getChapterToAnalysis(bookId, chapterIndex);

				if (!response.success) {
					uploadInfoContext.setUploadingFileInfo(response);
					return;
				}
				const { content } = response;

				const chapterContent = htmlToText(content);

				const res = await handleQuiz(chapterContent);

				if (!res.success) {
					uploadInfoContext.setUploadingFileInfo(res);
					return;
				}

				setQuestions(res.questions);
			} catch (error) {
				console.error(error);
				uploadInfoContext.setUploadingFileInfo({
					success: false,
					message: "Nie udało się przygotować pytań, spróbuj ponownie",
				});
			} finally {
				setIsLoading(false);
			}
		};

		launchModel();
	}, [bookId, chapterIndex]);

	useEffect(() => {
		let id: NodeJS.Timeout;
		if (isLoading) {
			id = setInterval(() => {
				setSentenceIndex((p) => (p + 1) % waitingSentences.length);
			}, 5000);
		}

		return () => clearInterval(id);
	}, [isLoading]);

	return (
		<div className="quiz absolute w-[min(90%,700px)] max-h-[85%] left-1/2 top-1/2 -translate-1/2 flex flex-col bg-panel/95 backdrop-blur-sm rounded-xl border border-accent/30 shadow-lg text-mainTxt font-lora z-110">
			{formState === "questions" && (
				<>
					<div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-accent/20">
						<div>
							<span className="text-xs font-semibold uppercase tracking-wide text-accent/70">
								Krok 1 z 2
							</span>
							<h2 className="mt-1 font-playfairDisplay text-2xl">
								Sprawdź się
							</h2>
							<p className="mt-1 text-sm text-mainTxt/60">
								Odpowiedz krótko, własnymi słowami. Nie zaglądaj do tekstu.
							</p>
						</div>
						<button
							onClick={() => onClose(false)}
							type="button"
							aria-label="Zamknij"
							className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 text-mainTxt/60 cursor-pointer transition-colors duration-300 hover:bg-accent/10 hover:text-accent">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round">
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</button>
					</div>

					{isLoading ? (
						<QuizQuestionsSkeleton />
					) : (
						<ul className="flex flex-col gap-5 p-5 sm:p-6 overflow-y-auto scrollbar-accent">
							{questions.map((question, index) => (
								<li key={question.id} className="flex flex-col gap-2">
									<label
										htmlFor={`question-${question.id}`}
										className="flex items-start gap-3 mb-2">
										<span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-semibold shrink-0">
											{index + 1}
										</span>
										<span className="font-medium leading-snug">
											{question.text}
										</span>
									</label>
									<textarea
										onChange={(e) =>
											setAnswers((prev) => ({
												...prev,
												[question.id]: e.target.value,
											}))
										}
										value={answers[question.id] ?? ""}
										id={`question-${question.id}`}
										rows={3}
										placeholder="Twoja odpowiedź…"
										className="w-full resize-none border border-accent/30 rounded-lg bg-transparent p-3 text-sm outline-0 focus:border-accent transition-colors placeholder:text-accent"
									/>
								</li>
							))}
						</ul>
					)}

					<div className="flex items-center justify-between gap-2 p-5 sm:p-6 border-t border-accent/20">
						{isLoading && (
							<span className="flex items-center gap-3">
								{waitingSentences[sentenceIndex]}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="none"
									viewBox="0 0 16 16"
									className="animate-spin fill-mainTxt">
									<path d="M9.25 1.5c0 .719-.563 1.25-1.25 1.25-.719 0-1.25-.531-1.25-1.25C6.75.812 7.281.25 8 .25c.688 0 1.25.563 1.25 1.25ZM8 13.25c.688 0 1.25.563 1.25 1.25 0 .719-.563 1.25-1.25 1.25-.719 0-1.25-.531-1.25-1.25 0-.688.531-1.25 1.25-1.25ZM15.75 8c0 .719-.563 1.25-1.25 1.25-.719 0-1.25-.531-1.25-1.25 0-.688.531-1.25 1.25-1.25.688 0 1.25.563 1.25 1.25Zm-13 0c0 .719-.563 1.25-1.25 1.25C.781 9.25.25 8.719.25 8c0-.688.531-1.25 1.25-1.25.688 0 1.25.563 1.25 1.25Zm.625-5.844c.719 0 1.25.563 1.25 1.25 0 .719-.531 1.25-1.25 1.25-.688 0-1.25-.531-1.25-1.25 0-.687.563-1.25 1.25-1.25Zm9.219 9.219c.687 0 1.25.531 1.25 1.25 0 .688-.563 1.25-1.25 1.25-.719 0-1.25-.563-1.25-1.25 0-.719.531-1.25 1.25-1.25Zm-9.219 0c.719 0 1.25.531 1.25 1.25 0 .688-.531 1.25-1.25 1.25-.688 0-1.25-.563-1.25-1.25 0-.719.563-1.25 1.25-1.25Z" />
								</svg>
							</span>
						)}
						<div>
							<button
								onClick={() => onClose(false)}
								type="button"
								className="px-4 py-2 rounded-full text-sm font-medium text-mainTxt/70 cursor-pointer transition-colors duration-300 hover:bg-accent/10">
								Anuluj
							</button>
							<button
								onClick={() => setFormState("reflection")}
								disabled={isLoading || questions.length === 0}
								type="button"
								className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-linear-to-r from-accent to-accentSecondary text-panel text-sm font-medium shadow-sm cursor-pointer transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none">
								Dalej
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round">
									<polyline points="9 18 15 12 9 6"></polyline>
								</svg>
							</button>
						</div>
					</div>
				</>
			)}

			{formState === "reflection" && (
				<>
					<div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-accent/20">
						<div>
							<span className="text-xs font-semibold uppercase tracking-wide text-accent/70">
								Krok 2 z 2
							</span>
							<h2 className="mt-1 font-playfairDisplay text-2xl">
								Twoja refleksja
							</h2>
							<p className="mt-1 text-sm text-mainTxt/60">
								Napisz kilka zdań o tym rozdziale. Liczy się twoje zdanie, nie
								streszczenie.
							</p>
						</div>
						<button
							onClick={() => onClose(false)}
							type="button"
							aria-label="Zamknij"
							className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 text-mainTxt/60 cursor-pointer transition-colors duration-300 hover:bg-accent/10 hover:text-accent">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round">
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</button>
					</div>

					<div className="flex flex-col gap-4 p-5 sm:p-6 overflow-y-auto scrollbar-accent">
						<div className="rounded-lg bg-accent/5 border border-accent/15 p-4">
							<span className="text-xs font-semibold uppercase tracking-wide text-accent/70">
								Możesz zacząć od
							</span>
							<ul className="mt-2 flex flex-col gap-1.5 text-sm text-mainTxt/70">
								<li>• Co w tym rozdziale zaskoczyło cię najbardziej?</li>
								<li>
									• Czy rozumiesz decyzje bohaterów? Postąpiłbyś tak samo?
								</li>
								<li>• Co autor chciał przez ten fragment przekazać?</li>
								<li>• Jakie zdanie albo scena zostanie z tobą na dłużej?</li>
							</ul>
						</div>

						<textarea
							onChange={(e) => {
								setReflectionValue(e.target.value);

								setCharactersCount(e.target.value.length);
							}}
							value={reflectionValue}
							rows={10}
							maxLength={300}
							placeholder="Zacznij pisać…"
							className="w-full min-h-48 resize-y border border-accent/30 rounded-lg bg-transparent px-3 py-2 text-sm leading-relaxed outline-0 focus:border-accent transition-colors"
						/>

						<span className="self-end text-xs text-mainTxt/50">
							{charactersCount} / 300 znaków
						</span>
					</div>

					<div className="flex items-center justify-between gap-2 p-5 sm:p-6 border-t border-accent/20">
						<button
							onClick={() => setFormState("questions")}
							type="button"
							className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-mainTxt/70 cursor-pointer transition-colors duration-300 hover:bg-accent/10">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round">
								<polyline points="15 18 9 12 15 6"></polyline>
							</svg>
							Wstecz
						</button>
						<button
							type="button"
							className="px-5 py-2 rounded-full bg-linear-to-r from-accent to-accentSecondary text-panel text-sm font-medium shadow-sm cursor-pointer transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none">
							Zakończ
						</button>
					</div>
				</>
			)}
		</div>
	);
}
