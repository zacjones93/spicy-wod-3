import type React from "react";

import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { signIn } from "@/auth";

export default function LoginPage() {
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

						<form
							action={async (formData: FormData) => {
								"use server";
								await signIn("credentials", {
									redirectTo: "/workouts",
									email: formData.get("email") as string,
									password: formData.get("password") as string,
								});
							}}
							className="p-6 space-y-6"
						>
							<div>
								<label className="block font-bold uppercase mb-2">Email</label>
								<input
									className="input"
									id="email"
									name="email"
									type="email"
									placeholder="user@acme.com"
									autoComplete="email"
									required
								/>
							</div>

							<div>
								<label className="block font-bold uppercase mb-2">
									Password
								</label>
								<input
									className="input"
									id="password"
									name="password"
									type="password"
									required
								/>
							</div>

							<div className="flex justify-between items-center">
								<label className="flex items-center gap-2">
									<input type="checkbox" className="h-5 w-5" />
									<span>Remember me</span>
								</label>
								<Link href="/forgot-password" className="text-sm underline">
									Forgot password?
								</Link>
							</div>

							<button type="submit" className="btn w-full">
								Login
							</button>

							<div className="text-center">
								<p>
									Don&apos;t have an account?{" "}
									<Link href="/signup" className="underline font-bold">
										Sign up
									</Link>
								</p>
							</div>
						</form>
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
