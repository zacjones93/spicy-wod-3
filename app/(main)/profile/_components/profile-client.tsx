"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "@/types/user";
import { useState } from "react";
import { updateUserNameAction } from "../actions";

interface ProfileClientProps {
	user: User;
}

export default function ProfileClient({ user }: ProfileClientProps) {
	const [name, setName] = useState(user.name || "");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// TODO: Implement actual name update logic
		// console.log("Updating name to:", name);
		// alert("Name update functionality not yet implemented.");

		// New code for calling server action
		if (!user.id) {
			setMessage("Error: User ID is missing.");
			return;
		}

		setLoading(true);
		setMessage(null);

		try {
			const result = await updateUserNameAction(user.id, name);
			if (result.success) {
				setMessage(result.success);
				// Optionally, update the user object in state if needed, or rely on revalidation
			} else if (result.error) {
				setMessage(result.error);
			}
		} catch (error) {
			console.error("Failed to submit form:", error);
			setMessage("An unexpected error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto max-w-xl py-8">
			<h1 className="mb-6 font-bold text-2xl">User Profile</h1>
			{message && (
				<div
					className={`mb-4 rounded-md p-3 ${
						message.startsWith("Error") || message.startsWith("An unexpected error")
							? "bg-red-100 text-red-700"
							: "bg-green-100 text-green-700"
					}`}
				>
					{message}
				</div>
			)}
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						value={user.email || ""}
						disabled
						className="mt-1"
					/>
				</div>
				<div>
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						type="text"
						value={name}
						onChange={handleNameChange}
						className="mt-1"
					/>
				</div>
				<Button className="bg-black text-white" type="submit" disabled={loading}>
					{loading ? "Saving..." : "Save Changes"}
				</Button>
			</form>
		</div>
	);
}
