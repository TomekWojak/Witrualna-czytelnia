"use client";
import { supabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
	const [error, setError] = useState("");
	const [emailValue, setEmailValue] = useState("");
	const [passwordValue, setPasswordValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const email = emailValue.trim();
		const password = passwordValue.trim();

		if (email === "" || password === "") {
			setError("Uzupełnij wymagane pola!");
			return;
		}
		try {
			setIsLoading(true);
			const client = await supabaseClient.auth.signInWithPassword({
				email,
				password,
			});

			if (client.error || client.data.user === null) {
				setError("Błędne dane logowania");
				return;
			}

			router.push("/dashboard");
			setError("");
		} catch (err) {
			console.log(err);
			return;
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center w-full bg-linear-to-br from-[#193f64] via-[#315f85] to-white">
			<form
				onSubmit={handleForm}
				className="flex flex-col w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl gap-5 text-accent">
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
				<button
					disabled={isLoading}
					className="disabled:opacity-80 disabled:pointer-events-none w-full flex justify-center gap-5 items-center px-5 py-2.5 bg-accent rounded-lg text-white cursor-pointer border border-transparent hover:text-accent hover:bg-transparent hover:border-accent transition-colors duration-300">
					Zaloguj
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
					Nie masz konta?{" "}
					<Link className="font-medium hover:underline" href="/rejestracja">
						Zerejestruj się
					</Link>
				</p>
			</form>
		</div>
	);
}
