"use client";
import Image from "next/image";
import {
	MAX_USERNAME_SETTINGS_LENGTH,
	MAX_BIO_SETTINGS_LENGTH,
} from "@/lib/formsConditions";
import { useRef, useState } from "react";
export default function Profile() {
	const avatarInputRefs = useRef<HTMLInputElement>(null);
	const [usernameValue, setUsernameValue] = useState("");
	const [textareaValue, setTextareaValue] = useState("");
	const validateField = (
		e:
			| React.ChangeEvent<HTMLInputElement, HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement, HTMLInputElement>,
		maxLength: number,
	) => {
		const value = e.target.value.trim();

		if (value.length >= maxLength + 1) {
			return true;
		}
		return false;
	};

	return (
		<>
			<p className="text-2xl font-semibold text-mainTxt">Profil</p>
			<p className="text-md mt-1 text-mainTxt">
				Zarządzaj swoimi danymi i ustawieniami konta
			</p>
			<div className="avatar-box mt-5 flex items-center gap-10">
				<Image
					src="/homePageAssets/church-7390546_1280.jpg"
					width={50}
					height={50}
					className="w-25 aspect-square rounded-full object-cover object-center"
					alt="Avatar użytkownika"
				/>
				<button
					onClick={() => avatarInputRefs.current?.click()}
					className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 text-accent text-sm font-medium cursor-pointer transition-colors hover:bg-accent/15 duration-300">
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
						className="feather feather-edit stroke-accent w-4">
						<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
						<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
					</svg>
					<span>Zmień avatar</span>
				</button>
				<input
					ref={avatarInputRefs}
					type="file"
					accept=".epub,.pdf,.mobi"
					className="hidden"
				/>
			</div>
			<div className="info mt-10 text-mainTxt">
				<label htmlFor="username" className="block mb-2">
					Nazwa użytkownika
				</label>
				<div className="group input-box relative">
					<input
						onChange={(e) => {
							const reachedMax = validateField(e, MAX_USERNAME_SETTINGS_LENGTH);

							if (reachedMax) return;
							setUsernameValue(e.target.value);
						}}
						value={usernameValue}
						type="text"
						id="username"
						className=" w-full p-2 border border-accent/20 rounded-md outline-0 focus:border-accent/70 transition-colors duration-300"
					/>
					<span className="absolute flex items-center justify-center right-0 inset-y-0 w-15 bg-panel border border-accent/20 rounded-md border-l-0 rounded-tl-none rounded-bl-none group-focus-within:border-accent/70 transition-colors duration-300 text-accent/70">
						{usernameValue.length}/{MAX_USERNAME_SETTINGS_LENGTH}
					</span>
				</div>
				<hr className="border-accent/20 my-10" />
				<label htmlFor="bio" className="block mb-2">
					Informacje o tobie
				</label>
				<div className="input-box relative flex flex-col">
					<textarea
						placeholder="Kilka słow o tobie..."
						value={textareaValue}
						onChange={(e) => {
							const reachedMax = validateField(e, MAX_BIO_SETTINGS_LENGTH);
							if (reachedMax) return;
							setTextareaValue(e.target.value);
						}}
						maxLength={MAX_BIO_SETTINGS_LENGTH}
						id="bio"
						className=" w-full p-2 border border-accent/20 rounded-md outline-0 focus:border-accent/70 transition-colors duration-300 min-h-30 max-h-35"
					/>
					<span className="block ml-auto mt-2 text-accent/70">
						{textareaValue.length}/{MAX_BIO_SETTINGS_LENGTH}
					</span>
				</div>
			</div>
			<button className="flex items-center gap-2 px-6 py-3 rounded-md bg-linear-to-r from-accent to-accentSecondary text-panel text-sm font-medium shadow-sm cursor-pointer transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95">
				Zapisz zmiany
			</button>
		</>
	);
}
