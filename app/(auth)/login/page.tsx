import type React from "react";

import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { LoginForm } from "./_components/login-form";
import { signIn } from "@/auth";

export default function LoginPage() {

	async function authenticateAction(
		prevState: string | undefined,
		formData: FormData
	) {
		"use server";
		try {
			await signIn("credentials", {
				redirectTo: "/workouts",
				email: formData.get("email") as string,
				password: formData.get("password") as string,
			});
		} catch (error) {
			if (
				error instanceof Error &&
				error.message.includes("CredentialsSignin")
			) {
				return "CredentialsSignin";
			}
			throw error;
		}
	}
	
	return (
		<div className="min-h-screen flex flex-col">
			<header className="border-b-2 border-black p-4">
				<div className="container mx-auto">
					<Link href="/" className="flex items-center gap-2">
						<Dumbbell className="h-8 w-8" />
						<h1 className="text-2xl font-black uppercase">spicy wod</h1>
					</Link>
				</div>
			</header>

			<main className="flex-1 flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					<div className="border-2 border-black">
						<div className="bg-black text-white p-4">
							<h2 className="text-xl font-bold uppercase">Login</h2>
						</div>
						<LoginForm authenticateAction={authenticateAction} />
					</div>
				</div>
			</main>

			<footer className="border-t-2 border-black p-4">
				<div className="container mx-auto">
					<p className="text-center">
						&copy; {new Date().getFullYear()} spicy wod. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
