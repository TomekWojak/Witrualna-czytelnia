"use client";
import { supabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ImportResult } from "@/lib/types";
export default function SignUpPage() {
	const [error, setError] = useState("");
	const [emailValue, setEmailValue] = useState("");
	const [passwordValue, setPasswordValue] = useState("");
	const [repeatPasswordValue, setRepeatPasswordValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [registrationStatus, setRegistrationStatus] =
		useState<ImportResult | null>(null);
	const router = useRouter();

	const handleForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const email = emailValue.trim();
		const password = passwordValue.trim();
		const repeatedPassword = repeatPasswordValue.trim();

		if (email === "" || password === "") {
			setError("Uzupełnij wymagane pola!");
			return;
		}

		if (password !== repeatedPassword) {
			setError("Hasła muszą być identyczne");
			return;
		}

		try {
			setIsLoading(true);

			const client = await supabaseClient.auth.signUp({
				email,
				password,
			});

			if (client.error || client.data.user === null) {
				if (client.error?.code === "user_already_exists") {
					setError("Użytkownik o podanym adresie email już istnieje!");
					return;
				}
				if (client.error?.code === "weak_password") {
					setError("Twoje hasło jest za słabe!");
					return;
				}

				setRegistrationStatus({
					success: false,
					message: "Nieudana próba rejestracji",
				});
				setError("Nieudana próba rejestracji");
				return;
			}

			setRegistrationStatus({
				success: true,
				message: "Zarejestrowano pomyślnie, teraz możesz się zalogować",
			});
			setTimeout(() => {
				router.push("/logowanie");
			}, 5000);

			setError("");
		} catch (err) {
			console.log(err);
			return;
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen relative flex items-center justify-center w-full bg-linear-to-br from-[#193f64] via-[#315f85] to-white">
			<form
				onSubmit={handleForm}
				className="flex flex-col w-full max-w-125 rounded-2xl bg-white p-8 shadow-2xl gap-5 text-accent">
				<div className="input-box">
					<label htmlFor="email">Email:</label>
					<input
						value={emailValue}
						onChange={(e) => setEmailValue(e.target.value)}
						type="email"
						id="email"
						className="w-full border border-accent/40 rounded-lg outline-0 p-2 mt-2 focus:border-accent transition-colors duration-300 text-accent"
					/>
				</div>
				<div className="input-box">
					<label htmlFor="password">Hasło:</label>
					<input
						value={passwordValue}
						onChange={(e) => setPasswordValue(e.target.value)}
						type="password"
						id="password"
						className="w-full border border-accent/40 rounded-lg outline-0 p-2 mt-2 focus:border-accent transition-colors duration-300 text-accent"
					/>
				</div>
				<div className="input-box">
					<label htmlFor="repeatPassword">Powtórz hasło:</label>
					<input
						value={repeatPasswordValue}
						onChange={(e) => setRepeatPasswordValue(e.target.value)}
						type="password"
						id="repeatPassword"
						className="w-full border border-accent/40 rounded-lg outline-0 p-2 mt-2 focus:border-accent transition-colors duration-300 text-accent"
					/>
				</div>
				<button
					disabled={isLoading}
					className="disabled:opacity-80 disabled:pointer-events-none w-full flex justify-center gap-5 items-center px-5 py-2.5 bg-accent rounded-lg text-white cursor-pointer border border-transparent hover:text-accent hover:bg-transparent hover:border-accent transition-colors duration-300">
					Zarejestruj się
					{isLoading && (
						<Image
							className="animate-spin"
							src="/homePageAssets/icon-loading.svg"
							width={16}
							height={16}
							alt=""
						/>
					)}
				</button>
				<p
					className={`${error ? "flex" : "hidden"} p-2 error items-center text-red-500 border border-red-500/40 bg-red-500/10 rounded-lg`}>
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
						className="feather feather-alert-circle w-4 shrink-0">
						<circle cx="12" cy="12" r="10"></circle>
						<line x1="12" y1="8" x2="12" y2="12"></line>
						<line x1="12" y1="16" x2="12.01" y2="16"></line>
					</svg>
					<span className="text-center block grow text-sm">{error}</span>
				</p>

				<p className="text-center text-accent/80">
					Posiadasz u nas konto?{" "}
					<Link className="font-medium hover:underline" href="/logowanie">
						Zaloguj się
					</Link>
				</p>
			</form>
			<p
				className={`duration-300 fixed right-4 bottom-4 w-fit gap-3 ${registrationStatus ? "translate-y-0 transition-transform duration-300 before:animate-[loadingBar_5s_infinite]" : "translate-y-125"} ${registrationStatus?.success ? "bg-green-500/20 text-green-500 border-green-500/40 before:bg-green-500" : "bg-red-500/20 text-red-500 border-red-500/40 before:bg-red-500"} p-3 flex items-center border rounded-lg font-medium before:content-[''] before:h-px before:w-full before:absolute before:left-0 before:top-0 overflow-hidden z-999`}>
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
					{registrationStatus?.message}
				</span>
			</p>
		</div>
	);
}
