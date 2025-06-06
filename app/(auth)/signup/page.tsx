import { createUser, getUser } from "@/server/functions/user";
import { Dumbbell } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignupFormClient from "./_components/signup-form-client";

import type { Metadata } from "next";

export const metadata: Metadata = {
	metadataBase: new URL("https://spicywod.com"),
	title: "Spicy WOD | Sign up",
	description: "Track your spicy workouts and progress.",
	openGraph: {
		title: "Spicy WOD | Sign up", // Default title for layout
		description: "Track your spicy workouts and progress.", // Default description
		images: [
			{
				url: `/api/og?title=${encodeURIComponent("Spicy WOD | Sign up")}`,
				width: 1200,
				height: 630,
				alt: "Spicy WOD | Sign up",
			},
		],
	},
};

export default function SignupPage() {
	async function registerAction(formData: FormData) {
		"use server";
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		// Basic validation (consider more robust validation)
		if (!email || !password) {
			return "Email and password are required.";
		}
		// Add more validation for email format, password complexity etc.

		const user = await getUser(email);

		if (user) {
			return "User already exists"; // TODO: Handle errors with useFormStatus in client component
		}
		console.log(
			`[register] Creating user with email: ${email} and password: ${password.substring(
				0,
				3,
			)}...`,
		);
		await createUser(email, password);
		redirect("/login"); // Redirect on successful creation
	}

	return (
		<div className="flex min-h-screen flex-col">
			<header className="border-black border-b-2 p-4">
				<div className="container mx-auto">
					<Link href="/" className="flex items-center gap-2">
						<Dumbbell className="h-8 w-8" />
						<h1 className="font-black text-2xl uppercase">spicy wod</h1>
					</Link>
				</div>
			</header>

			<main className="flex flex-1 items-center justify-center p-4">
				<div className="w-full max-w-md">
					<div className="border-2 border-black">
						<div className="bg-black p-4 text-white">
							<h2 className="font-bold text-xl uppercase">Sign Up</h2>
						</div>
						<SignupFormClient registerAction={registerAction} />
					</div>
				</div>
			</main>

			<footer className="border-black border-t-2 p-4">
				<div className="container mx-auto">
					<p className="text-center">
						&copy; {new Date().getFullYear()} spicy wod. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
