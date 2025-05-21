import { createUser, getUser } from "@/server/functions/user";
import { Dumbbell } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignupFormClient from "./_components/signup-form-client";

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
							<h2 className="text-xl font-bold uppercase">Sign Up</h2>
						</div>
						<SignupFormClient registerAction={registerAction} />
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
