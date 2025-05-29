import type React from "react";

import { signIn } from "@/auth";
import { Dumbbell } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "./_components/login-form";

import type { Metadata } from "next";

export const metadata: Metadata = {
	metadataBase: new URL("https://spicywod.com"),
	title: "Spicy WOD | Login",
	description: "Track your spicy workouts and progress.",
	openGraph: {
		title: "Spicy WOD | Login", // Default title for layout
		description: "Track your spicy workouts and progress.", // Default description
		images: [
			{
				url: `/api/og?title=${encodeURIComponent("Spicy WOD | Login")}`,
				width: 1200,
				height: 630,
				alt: "Spicy WOD | Login",
			},
		],
	},
};

export default function LoginPage() {
	async function authenticateAction(prevState: string | undefined, formData: FormData) {
		"use server";
		try {
			await signIn("credentials", {
				redirectTo: "/workouts",
				email: formData.get("email") as string,
				password: formData.get("password") as string,
			});
		} catch (error) {
			if (error instanceof Error && error.message.includes("CredentialsSignin")) {
				return "CredentialsSignin";
			}
			throw error;
		}
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
							<h2 className="font-bold text-xl uppercase">Login</h2>
						</div>
						<LoginForm authenticateAction={authenticateAction} />
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
