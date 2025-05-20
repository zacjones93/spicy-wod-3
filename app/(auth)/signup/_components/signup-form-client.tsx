"use client";

import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

interface SignupFormClientProps {
	register: (formData: FormData) => Promise<string | undefined>;
}

export default function SignupFormClient({ register }: SignupFormClientProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { pending } = useFormStatus();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorMessage(null); // Clear previous errors

		if (password !== confirmPassword) {
			setErrorMessage("Passwords do not match");
			return;
		}
		const formData = new FormData();
		formData.append("email", email);
		formData.append("password", password);
		const result = await register(formData);
		if (result) {
			setErrorMessage(result);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="p-6 space-y-6">
			{errorMessage && (
				<div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded">
					{errorMessage}
				</div>
			)}
			<div>
				<label className="block font-bold uppercase mb-2">Email</label>
				<input
					type="email"
					name="email"
					className="input"
					value={email}
					onChange={(e) => {
						setEmail(e.target.value);
						setErrorMessage(null);
					}}
					required
					disabled={pending}
				/>
			</div>

			<div>
				<label className="block font-bold uppercase mb-2">Password</label>
				<input
					type="password"
					name="password"
					className="input"
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
						setErrorMessage(null);
					}}
					required
					disabled={pending}
				/>
			</div>

			<div>
				<label className="block font-bold uppercase mb-2">
					Confirm Password
				</label>
				<input
					type="password"
					className="input"
					value={confirmPassword}
					onChange={(e) => {
						setConfirmPassword(e.target.value);
						setErrorMessage(null);
					}}
					required
					disabled={pending}
				/>
			</div>

			<div className="flex items-center gap-2">
				<input
					type="checkbox"
					className="h-5 w-5"
					required
					disabled={pending}
				/>
				<span>
					I agree to the{" "}
					<Link href="/terms" className="underline">
						Terms of Service
					</Link>{" "}
					and{" "}
					<Link href="/privacy" className="underline">
						Privacy Policy
					</Link>
				</span>
			</div>

			<button type="submit" className="btn w-full" disabled={pending}>
				{pending ? "Creating Account..." : "Create Account"}
			</button>

			<div className="text-center">
				<p>
					Already have an account?{" "}
					<Link href="/login" className="underline font-bold">
						Login
					</Link>
				</p>
			</div>
		</form>
	);
}
