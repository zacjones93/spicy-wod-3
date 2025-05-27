"use client";

import { movements } from "@/server/db/schema";
import type { Movement } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
	createMovementAction: (data: {
		name: string;
		type: string;
		// userId will be added on the server
	}) => Promise<void>;
}

const MOVEMENT_TYPES = movements.type.enumValues;

export default function CreateMovementForm({ createMovementAction }: Props) {
	const [name, setName] = useState("");
	const [type, setType] = useState<Movement["type"]>();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		if (!name || !type) {
			setError("Name and type are required.");
			setIsSubmitting(false);
			return;
		}

		try {
			await createMovementAction({ name, type });
			// Assuming the server action handles potential errors and revalidates/redirects
			// For now, we redirect on the client side after successful submission
			router.push("/movements"); // Redirect to the movements list page
		} catch (err) {
			console.error("Failed to create movement:", err);
			setError(err instanceof Error ? err.message : "An unknown error occurred.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center gap-2">
					<Link href="/movements" className="btn-outline p-2">
						<ArrowLeft className="h-5 w-5" />
					</Link>
					<h1>CREATE MOVEMENT</h1>
				</div>
			</div>

			<form className="border-2 border-black p-6 max-w-md mx-auto" onSubmit={handleSubmit}>
				<div className="space-y-6">
					<div>
						<label htmlFor="movementName" className="block font-bold uppercase mb-2">
							Movement Name
						</label>
						<input
							id="movementName"
							type="text"
							className="input"
							placeholder="e.g., Back Squat, Thruster, Burpee"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>

					<div>
						<label htmlFor="movementType" className="block font-bold uppercase mb-2">
							Movement Type
						</label>
						<select
							id="movementType"
							className="select"
							value={type}
							onChange={(e) => setType(e.target.value as Movement["type"])}
							required
						>
							<option value="">Select a type</option>
							{MOVEMENT_TYPES.map((movementType) => (
								<option key={movementType} value={movementType}>
									{movementType}
								</option>
							))}
						</select>
					</div>

					{error && <p className="text-red-500">{error}</p>}

					<button type="submit" className="btn w-full" disabled={isSubmitting}>
						{isSubmitting ? "Creating..." : "Create Movement"}
					</button>
				</div>
			</form>
		</div>
	);
}
