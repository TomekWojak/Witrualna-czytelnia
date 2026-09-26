"use client";
import Image from "next/image";
import {
	MAX_USERNAME_SETTINGS_LENGTH,
	MAX_BIO_SETTINGS_LENGTH,
} from "@/lib/formsConditions";
import { supabaseClient } from "@/lib/supabase";
import { UserProfileContext } from "@/lib/UserProfileContext";
import { useContext, useEffect, useRef, useState } from "react";
export default function Profile() {
	const { setUserData } = useContext(UserProfileContext);
	const avatarInputRefs = useRef<HTMLInputElement>(null);
	const [usernameValue, setUsernameValue] = useState("");
	const [textareaValue, setTextareaValue] = useState("");
	const [initialData, setInitalData] = useState({ name: "", bio: "" });
	const [userId, setUserId] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);

	const isDirty =
		usernameValue !== initialData.name || textareaValue !== initialData.bio;

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

	const handleSave = async () => {
		try {
			setIsLoading(true);

			await supabaseClient
				.from("profiles")
				.update({ name: usernameValue, bio: textareaValue })
				.eq("id", userId);

			setInitalData({ name: usernameValue, bio: textareaValue });
			setUserData((prev) =>
				prev
					? { ...prev, name: usernameValue, bio: textareaValue }
					: { name: usernameValue, bio: textareaValue, avatar_url: null, plan: "" },
			);
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const getData = async () => {
			const {
				data: { user },
			} = await supabaseClient.auth.getUser();

			if (!user) {
				throw new Error("Wystąpił problem z identyfikacją użytkownika");
			}

			const { data, error } = await supabaseClient
				.from("profiles")
				.select("name, bio")
				.eq("id", user.id)
				.single();

			if (!data) {
				console.error(error);
				return;
			}

			setUserId(user.id);
			setInitalData({ name: data.name ?? "", bio: data.bio ?? "" });
			setUsernameValue(data.name ?? "");
			setTextareaValue(data.bio ?? "");
			setUserData((prev) =>
				prev
					? { ...prev, name: data.name, bio: data.bio }
					: { name: data.name, bio: data.bio, avatar_url: null, plan: "" },
			);
		};
		getData();
	}, [setUserData]);

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
							const reachedMax = validateField(e, 20);

							if (reachedMax) return;
							setUsernameValue(e.target.value);
						}}
						value={usernameValue}
						type="text"
						id="username"
						className=" w-full p-2 border border-accent/20 rounded-md outline-0 focus:border-accent/70 transition-colors duration-300"
					/>
					<span className="absolute flex items-center justify-center right-0 inset-y-0 w-15 bg-panel border border-accent/20 rounded-md border-l-0 rounded-tl-none rounded-bl-none group-focus-within:border-accent/70 transition-colors duration-300 text-accent/70">
						{usernameValue.length}/{20}
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
							const reachedMax = validateField(e, 400);
							if (reachedMax) return;
							setTextareaValue(e.target.value);
						}}
						maxLength={400}
						id="bio"
						className=" w-full p-2 border border-accent/20 rounded-md outline-0 focus:border-accent/70 transition-colors duration-300 min-h-30 max-h-35 text-mainTxt placeholder:text-mainTxt"
					/>
					<span className="block ml-auto mt-2 text-accent/70">
						{textareaValue.length}/{400}
						{/* zmienić na MAX_BIO... */}
					</span>
				</div>
			</div>
			<button
				onClick={handleSave}
				disabled={!isDirty || isLoading}
				className="flex items-center gap-3 px-6 py-3 rounded-md bg-linear-to-r from-accent to-accentSecondary text-panel text-sm font-medium shadow-sm cursor-pointer transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none">
				Zapisz zmiany
				{isLoading && (
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
		</>
	);
}
