"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import type React from "react";
import { useFormStatus } from "react-dom";

// Helper function to set a cookie
function setCookie(name: string, value: string, days: number) {
	let expires = "";
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = `; expires=${date.toUTCString()}`;
	}
	document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

// Helper function to get a cookie
function getCookie(name: string): string | null {
	const nameEQ = `${name}=`;
	const ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

// Helper function to erase a cookie
function eraseCookie(name: string) {
	document.cookie = `${name}=; Max-Age=-99999999; path=/`;
}

interface LoginFormProps {
	authenticateAction: (
		prevState: string | undefined,
		formData: FormData,
	) => Promise<string | undefined>;
}

export function LoginForm({ authenticateAction }: LoginFormProps) {
	const [email, setEmail] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const { pending } = useFormStatus();

	useEffect(() => {
		const rememberedEmail = getCookie("rememberedEmail");
		if (rememberedEmail) {
			setEmail(rememberedEmail);
			setRememberMe(true);
		}
	}, []);

	const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRememberMe(e.target.checked);
		if (e.target.checked) {
			setCookie("rememberedEmail", email, 30); // Remember for 30 days
		} else {
			eraseCookie("rememberedEmail");
		}
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newEmail = e.target.value;
		setEmail(newEmail);
		if (rememberMe) {
			setCookie("rememberedEmail", newEmail, 30);
		}
	};

	const [errorMessage, dispatch] = useActionState(authenticateAction, undefined);

	return (
		<form action={dispatch} className="p-6 space-y-6">
			<div>
				<label className="block font-bold uppercase mb-2" htmlFor="email">
					Email
				</label>
				<input
					className="input"
					id="email"
					name="email"
					type="email"
					placeholder="user@acme.com"
					autoComplete="email"
					required
					value={email}
					onChange={handleEmailChange}
				/>
			</div>

			<div>
				<label className="block font-bold uppercase mb-2" htmlFor="password">
					Password
				</label>
				<input className="input" id="password" name="password" type="password" required />
			</div>

			{errorMessage === "CredentialsSignin" && (
				<div className="text-red-500 text-sm">
					Invalid email or password. Please try again.
				</div>
			)}

			<div className="flex justify-between items-center">
				<label className="flex items-center gap-2">
					<input
						type="checkbox"
						className="h-5 w-5"
						checked={rememberMe}
						onChange={handleRememberMeChange}
					/>
					<span>Remember me</span>
				</label>
				<Link href="/forgot-password" prefetch={false} className="text-sm underline">
					Forgot password?
				</Link>
			</div>

			<button type="submit" aria-disabled={pending} className="btn w-full">
				{pending ? "Logging in..." : "Login"}
			</button>

			<div className="text-center">
				<p>
					Don&apos;t have an account?{" "}
					<Link href="/signup" prefetch={false} className="underline font-bold">
						Sign up
					</Link>
				</p>
			</div>
		</form>
	);
}
