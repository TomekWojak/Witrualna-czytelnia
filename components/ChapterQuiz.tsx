"use client";
import { useContext, useEffect, useState } from "react";
import { UploadInfoContext } from "@/lib/UploadInfoContext";
import { getChapterToAnalysis } from "@/lib/getChapterToAnalysis";
import { htmlToText } from "@/lib/htmlToText";
import { handleQuiz } from "@/lib/api/quizInteraction";
import type { QuizQuestion, QuizReview } from "@/lib/types";
import { QuizQuestionsSkeleton } from "@/components/Skeleton";
import { validateReflections } from "@/lib/validateFields";
import { handleQuizReview } from "@/lib/api/quizReview";

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
	const [questions, setQuestions] = useState<QuizQuestion[]>([
		{ id: 1, text: "test" },
	]);
	const [isLoading, setIsLoading] = useState(true);
	const [summaryLoading, setSummaryLoading] = useState(false);
	const [sentenceIndex, setSentenceIndex] = useState(0);
	const [charactersCount, setCharactersCount] = useState(0);
	const [reflectionValue, setReflectionValue] = useState("");
	const [emptyQuestionsInfo, setEmptyQuestionsInfo] = useState({
		isVisible: false,
		message: "",
	});
	const [emptyError, setEmptyError] = useState("");
	const [summaryData, setSummaryData] = useState<QuizReview | null>(null);

	const uploadInfoContext = useContext(UploadInfoContext);

	const handleQuizAnswers = async () => {
		const userAnswers = questions.map((question) => {
			return {
				question: question.text,
				answer: answers[question.id] ?? "",
			};
		});

		if (!userAnswers || userAnswers.length === 0) return;

		const fieldIsEmpty = validateReflections(reflectionValue);

		if (!fieldIsEmpty.success) {
			setEmptyError(fieldIsEmpty.message);
			return;
		}

		const input = {
			bookId,
			chapterIndex,
			answers: userAnswers,
			reflection: reflectionValue,
		};
		try {
			setSummaryLoading(true);

			const res = await handleQuizReview(input);

			if (!res.success) {
				uploadInfoContext.setUploadingFileInfo(res);
				return;
			}
			setFormState("done");
			setSummaryData(res.review);
		} catch (err) {
			console.error(err);
		} finally {
			setSummaryLoading(false);
		}
	};

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
	}, [bookId, chapterIndex, uploadInfoContext]);

	useEffect(() => {
		let id: NodeJS.Timeout;
		if (isLoading) {
			id = setInterval(() => {
				setSentenceIndex((p) => (p + 1) % waitingSentences.length);
			}, 5000);
		}

		return () => clearInterval(id);
	}, [isLoading]);

	const validateFields = () => {
		if (Object.keys(answers).length === 0) {
			setEmptyQuestionsInfo((prev) => ({
				...prev,
				isVisible: true,
				message: "Pominięto 3 pytania, kontynuować?",
			}));
			return false;
		}

		const emptyQuestions = questions.filter((question) => {
			return answers[question.id] === undefined || answers[question.id] === "";
		});

		if (emptyQuestions.length === 3) {
			setEmptyQuestionsInfo((prev) => ({
				...prev,
				isVisible: true,
				message: "Pominięto 3 pytania, kontynuować?",
			}));
			return false;
		}
		if (emptyQuestions.length === 2) {
			setEmptyQuestionsInfo((prev) => ({
				...prev,
				isVisible: true,
				message: "Pominięto 2 pytania, czy kontynuować?",
			}));
			return false;
		}
		if (emptyQuestions.length === 1) {
			setEmptyQuestionsInfo((prev) => ({
				...prev,
				isVisible: true,
				message: "Pominięto 1 pytanie, czy kontynuować?",
			}));

			return false;
		}

		return true;
	};

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
							className="flex items-center justify-center w-9 h-9 rounded-md shrink-0 text-mainTxt/60 cursor-pointer transition-colors duration-300 hover:bg-accent/10 hover:text-accent">
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
						<div
							className={`flex items-center gap-2 ${isLoading ? "" : "ml-auto"}`}>
							<button
								onClick={() => onClose(false)}
								type="button"
								className="px-4 py-2 rounded-md text-sm font-medium text-mainTxt/70 cursor-pointer transition-colors duration-300 hover:bg-accent/10">
								Anuluj
							</button>
							<button
								onClick={() => {
									const noEmptyAnswers = validateFields();

									if (noEmptyAnswers) {
										setFormState("reflection");
									}
								}}
								disabled={isLoading || questions.length === 0}
								type="button"
								className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-linear-to-r from-accent to-accentSecondary text-panel text-sm font-medium shadow-sm cursor-pointer transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none">
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
								setEmptyError("");
								setCharactersCount(e.target.value.length);
							}}
							value={reflectionValue}
							rows={10}
							maxLength={300}
							placeholder="Zacznij pisać…"
							className="w-full min-h-48 resize-y border border-accent/30 rounded-lg bg-transparent px-3 py-2 text-sm leading-relaxed outline-0 focus:border-accent transition-colors"
						/>
						<div className="flex justify-between items-center">
							{emptyError && (
								<p className="text-red-500 text-sm flex items-center gap-2 py-1 px-4 rounded-md border border-red-500/40 bg-red-500/10">
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
										className="w-4">
										<circle cx="12" cy="12" r="10"></circle>
										<line x1="12" y1="8" x2="12" y2="12"></line>
										<line x1="12" y1="16" x2="12.01" y2="16"></line>
									</svg>
									{emptyError}
								</p>
							)}
							<span
								className={`text-xs text-mainTxt/50 ${emptyError ? "" : "ml-auto"}`}>
								{charactersCount} / 300 znaków
							</span>
						</div>
					</div>

					<div className="flex items-center justify-between gap-2 p-5 sm:p-6 border-t border-accent/20">
						<button
							onClick={() => setFormState("questions")}
							type="button"
							className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-mainTxt/70 cursor-pointer transition-colors duration-300 hover:bg-accent/10">
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
							onClick={handleQuizAnswers}
							disabled={summaryLoading}
							type="button"
							className="flex items-center gap-2 px-5 py-2 rounded-md bg-linear-to-r from-accent to-accentSecondary text-panel text-sm font-medium shadow-sm cursor-pointer transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none">
							Zakończ
							{summaryLoading && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="none"
									viewBox="0 0 16 16"
									className="animate-spin fill-panel">
									<path d="M9.25 1.5c0 .719-.563 1.25-1.25 1.25-.719 0-1.25-.531-1.25-1.25C6.75.812 7.281.25 8 .25c.688 0 1.25.563 1.25 1.25ZM8 13.25c.688 0 1.25.563 1.25 1.25 0 .719-.563 1.25-1.25 1.25-.719 0-1.25-.531-1.25-1.25 0-.688.531-1.25 1.25-1.25ZM15.75 8c0 .719-.563 1.25-1.25 1.25-.719 0-1.25-.531-1.25-1.25 0-.688.531-1.25 1.25-1.25.688 0 1.25.563 1.25 1.25Zm-13 0c0 .719-.563 1.25-1.25 1.25C.781 9.25.25 8.719.25 8c0-.688.531-1.25 1.25-1.25.688 0 1.25.563 1.25 1.25Zm.625-5.844c.719 0 1.25.563 1.25 1.25 0 .719-.531 1.25-1.25 1.25-.688 0-1.25-.531-1.25-1.25 0-.687.563-1.25 1.25-1.25Zm9.219 9.219c.687 0 1.25.531 1.25 1.25 0 .688-.563 1.25-1.25 1.25-.719 0-1.25-.563-1.25-1.25 0-.719.531-1.25 1.25-1.25Zm-9.219 0c.719 0 1.25.531 1.25 1.25 0 .688-.531 1.25-1.25 1.25-.688 0-1.25-.563-1.25-1.25 0-.719.563-1.25 1.25-1.25Z" />
								</svg>
							)}
						</button>
					</div>
				</>
			)}
			{formState === "done" && summaryData && (
				<>
					<div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-accent/20">
						<div>
							<span className="text-xs font-semibold uppercase tracking-wide text-accent/70">
								Podsumowanie
							</span>
							<h2 className="mt-1 font-playfairDisplay text-2xl">
								Jak ci poszło?
							</h2>
							<p className="mt-1 text-sm text-mainTxt/60">
								Przeczytaj uwagi i wróć do fragmentów, które umknęły.
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

					<div className="flex flex-col gap-8 p-5 sm:p-6 overflow-y-auto scrollbar-accent">
						<section className="flex flex-col gap-6">
							<h3 className="text-xs font-semibold uppercase tracking-wide text-accent/70">
								Pytania
							</h3>
							<ul className="flex flex-col gap-8">
								{summaryData.answers.map((item) => {
									const isAnswered = item.user_answer.trim() !== "";

									return (
										<li key={item.id} className="flex flex-col gap-4">
											<div className="flex items-start gap-3">
												<span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-semibold shrink-0">
													{item.id}
												</span>
												<span className="font-medium leading-snug">
													{
														questions.find(
															(question) => question.id === item.id,
														)?.text
													}
												</span>
											</div>

											<div className="flex flex-col gap-2 text-sm">
												<span className="text-xs font-semibold uppercase tracking-wide text-mainTxt/50">
													Twoja odpowiedź
												</span>
												<p
													className={`p-4 border-l-3 rounded-r-md leading-relaxed whitespace-pre-line ${isAnswered ? "border-accent/50 bg-accent/5" : "border-mainTxt/20 bg-mainTxt/5 italic text-mainTxt/50"}`}>
													{isAnswered
														? item.user_answer
														: "Nie udzielono odpowiedzi"}
												</p>
											</div>

											<div className="flex flex-col gap-2 text-sm sm:ml-6">
												<span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="14"
														height="14"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round">
														<path d="M12 3l1.9 5.8L20 10.7l-6.1 1.9L12 18.5l-1.9-5.9L4 10.7l6.1-1.9z"></path>
													</svg>
													{isAnswered ? "Ocena" : "Co warto wiedzieć"}
												</span>
												<p className="p-4 border-l-3 border-accent bg-accent/15 rounded-r-md leading-relaxed whitespace-pre-line">
													{item.model_answer}
												</p>
											</div>
										</li>
									);
								})}
							</ul>
						</section>

						<span className="block h-px bg-accent/20" />

						<section className="flex flex-col gap-4">
							<h3 className="text-xs font-semibold uppercase tracking-wide text-accent/70">
								Refleksja
							</h3>

							<div className="flex flex-col gap-2 text-sm">
								<span className="text-xs font-semibold uppercase tracking-wide text-mainTxt/50">
									Twoja refleksja
								</span>
								<blockquote className="p-4 border-l-3 border-accent/50 bg-accent/5 rounded-r-md leading-relaxed italic whitespace-pre-line">
									{summaryData.reflections.user_reflection}
								</blockquote>
							</div>

							<div className="flex flex-col gap-2 text-sm sm:ml-6">
								<span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round">
										<path d="M12 3l1.9 5.8L20 10.7l-6.1 1.9L12 18.5l-1.9-5.9L4 10.7l6.1-1.9z"></path>
									</svg>
									Uwagi do refleksji
								</span>
								<p className="p-4 border-l-3 border-accent bg-accent/15 rounded-r-md leading-relaxed whitespace-pre-line">
									{summaryData.reflections.model_reflection}
								</p>
							</div>
						</section>
					</div>

					<div className="flex items-center justify-end gap-2 p-5 sm:p-6 border-t border-accent/20">
						<button
							onClick={() => onClose(false)}
							type="button"
							className="px-5 py-2 rounded-md bg-linear-to-r from-accent to-accentSecondary text-panel text-sm font-medium shadow-sm cursor-pointer transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95">
							Wróć do czytania
						</button>
					</div>
				</>
			)}

			{emptyQuestionsInfo.isVisible && (
				<>
					<div
						role="alertdialog"
						aria-labelledby="empty-questions-title"
						aria-describedby="empty-questions-message"
						className="absolute left-1/2 top-1/2 -translate-1/2 w-[80%] max-w-sm flex flex-col items-center text-center gap-3 p-6 bg-panel/90 backdrop-blur-sm border border-accent/20 rounded-xl shadow-lg z-10">
						<div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="22"
								height="22"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round">
								<circle cx="12" cy="12" r="10"></circle>
								<line x1="12" y1="8" x2="12" y2="12"></line>
								<line x1="12" y1="16" x2="12.01" y2="16"></line>
							</svg>
						</div>
						<h3
							id="empty-questions-title"
							className="font-playfairDisplay text-lg">
							Nie wszystko uzupełnione
						</h3>
						<p
							id="empty-questions-message"
							className="text-sm text-mainTxt/70 leading-relaxed">
							{emptyQuestionsInfo.message}
						</p>
						<div className="flex items-center justify-center gap-2 mt-2">
							<button
								type="button"
								onClick={() =>
									setEmptyQuestionsInfo((prev) => ({
										...prev,
										isVisible: false,
									}))
								}
								className="px-4 py-2 rounded-md text-sm font-medium text-mainTxt/70 cursor-pointer transition-colors duration-300 hover:bg-accent/10">
								Powrót
							</button>
							<button
								type="button"
								onClick={() => {
									setEmptyQuestionsInfo((prev) => ({
										...prev,
										isVisible: false,
									}));
									setFormState("reflection");
								}}
								className="px-5 py-2 rounded-md bg-linear-to-r from-accent to-accentSecondary text-panel text-sm font-medium shadow-sm cursor-pointer transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95">
								Kontynuuj
							</button>
						</div>
					</div>
					<div className="overlay absolute inset-0 bg-accent/10 rounded-xl z-9"></div>
				</>
			)}
		</div>
	);
}
