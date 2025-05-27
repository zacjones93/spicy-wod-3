"use client";

import type { Movement, Tag, Workout, WorkoutCreate } from "@/types";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
	movements: Movement[];
	tags: Tag[];
	createWorkoutAction: (data: {
		workout: Omit<WorkoutCreate, "createdAt">;
		tagIds: Tag["id"][];
		movementIds: Movement["id"][];
	}) => Promise<void>;
}

export default function CreateWorkoutClient({
	movements,
	tags: initialTags,
	createWorkoutAction,
}: Props) {
	const [tags, setTags] = useState<Tag[]>(initialTags);
	const [selectedMovements, setSelectedMovements] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [scheme, setScheme] = useState<Workout["scheme"]>();
	const [scope, setScope] = useState<Workout["scope"]>("private");
	const [roundsToScore, setRoundsToScore] = useState<number | undefined>(undefined);
	const [repsPerRound, setRepsPerRound] = useState<number | undefined>(undefined);
	const router = useRouter();

	const handleAddTag = () => {
		if (newTag && !tags.some((t) => t.name === newTag)) {
			const id = crypto.randomUUID();
			setTags([...tags, { id, name: newTag }]);
			setSelectedTags([...selectedTags, id]);
			setNewTag("");
		}
	};

	const handleRemoveTag = (tagId: string) => {
		setSelectedTags(selectedTags.filter((id) => id !== tagId));
	};

	const handleMovementToggle = (movementId: string) => {
		if (selectedMovements.includes(movementId)) {
			setSelectedMovements(selectedMovements.filter((id) => id !== movementId));
		} else {
			setSelectedMovements([...selectedMovements, movementId]);
		}
	};

	const handleTagToggle = (tagId: string) => {
		if (selectedTags.includes(tagId)) {
			setSelectedTags(selectedTags.filter((id) => id !== tagId));
		} else {
			setSelectedTags([...selectedTags, tagId]);
		}
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		const workoutId = crypto.randomUUID();

		if (!scheme) throw new Error("Must provide a workout scheme");

		await createWorkoutAction({
			workout: {
				id: workoutId,
				name,
				description,
				scheme,
				scope,
				roundsToScore,
				repsPerRound,
			},
			tagIds: selectedTags,
			movementIds: selectedMovements,
		});
		router.push(`/workouts/${workoutId}`);
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center gap-2">
					<Link href="/workouts" className="btn-outline p-2">
						<ArrowLeft className="h-5 w-5" />
					</Link>
					<h1>CREATE WORKOUT</h1>
				</div>
			</div>

			<form className="border-2 border-black p-6" onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-6">
						<div>
							<label className="block font-bold uppercase mb-2">Workout Name</label>
							<input
								type="text"
								className="input"
								placeholder="e.g., Fran, Cindy, Custom WOD"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						<div>
							<label className="block font-bold uppercase mb-2">Description</label>
							<textarea
								className="textarea"
								rows={4}
								placeholder="Describe the workout (e.g., 21-15-9 reps for time of Thrusters and Pull-ups)"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
							/>
						</div>

						<div>
							<label className="block font-bold uppercase mb-2">Scheme</label>
							<select
								className="select"
								value={scheme}
								onChange={(e) => setScheme(e.target.value as Workout["scheme"])}
								required
							>
								<option value="">Select a scheme</option>
								<option value="time">For Time</option>
								<option value="time-with-cap">For Time (with cap)</option>
								<option value="rounds-reps">AMRAP (Rounds + Reps)</option>
								<option value="reps">Max Reps</option>
								<option value="emom">EMOM</option>
								<option value="load">Max Load</option>
								<option value="calories">Calories</option>
								<option value="meters">Meters</option>
								<option value="pass-fail">Pass/Fail</option>
							</select>
						</div>

						<div>
							<label className="block font-bold uppercase mb-2">Scope</label>
							<select
								className="select"
								value={scope}
								onChange={(e) => setScope(e.target.value as Workout["scope"])}
								required
							>
								<option value="private">Private</option>
								<option value="public">Public</option>
							</select>
						</div>

						<div>
							<label className="block font-bold uppercase mb-2">
								Rounds to Score
							</label>
							<input
								type="number"
								className="input"
								placeholder="e.g., 4 (default is 1)"
								value={roundsToScore === undefined ? "" : roundsToScore}
								onChange={(e) =>
									setRoundsToScore(
										e.target.value
											? Number.parseInt(e.target.value)
											: undefined,
									)
								}
								min="0"
							/>
						</div>

						<div>
							<label className="block font-bold uppercase mb-2">
								Reps per Round (if applicable)
							</label>
							<input
								type="number"
								className="input"
								placeholder="e.g., 10"
								value={repsPerRound === undefined ? "" : repsPerRound}
								onChange={(e) =>
									setRepsPerRound(
										e.target.value
											? Number.parseInt(e.target.value)
											: undefined,
									)
								}
								min="0"
							/>
						</div>

						<div>
							<label className="block font-bold uppercase mb-2">Tags</label>
							<div className="flex gap-2 mb-2">
								<input
									type="text"
									className="input flex-1"
									placeholder="Add a tag"
									value={newTag}
									onChange={(e) => setNewTag(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddTag();
										}
									}}
								/>
								<button type="button" className="btn" onClick={handleAddTag}>
									<Plus className="h-5 w-5" />
								</button>
							</div>

							<div className="flex flex-wrap gap-2 mt-2">
								{tags.map((tag) => (
									<div
										key={tag.id}
										className={`flex items-center border-2 border-black px-2 py-1 cursor-pointer ${
											selectedTags.includes(tag.id)
												? "bg-black text-white"
												: ""
										}`}
										onClick={() => handleTagToggle(tag.id)}
									>
										<span className="mr-2">{tag.name}</span>
										{selectedTags.includes(tag.id) && (
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													handleRemoveTag(tag.id);
												}}
												className="text-red-500"
											>
												<X className="h-4 w-4" />
											</button>
										)}
									</div>
								))}
							</div>
						</div>
					</div>

					<div>
						<label className="block font-bold uppercase mb-2">Movements</label>
						<div className="border-2 border-black p-4 h-[500px] overflow-y-auto">
							<div className="space-y-2">
								{movements.map((movement) => (
									<div
										key={movement.id}
										className={`p-3 border-2 ${
											selectedMovements.includes(movement.id)
												? "border-black bg-black text-white"
												: "border-gray-300"
										} cursor-pointer`}
										onClick={() => handleMovementToggle(movement.id)}
									>
										<div className="flex justify-between items-center">
											<span className="font-bold">{movement.name}</span>
											<span className="text-xs uppercase">
												{movement.type}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="flex justify-end gap-4 mt-6">
					<Link href="/workouts" className="btn-outline">
						Cancel
					</Link>
					<button type="submit" className="btn">
						Create Workout
					</button>
				</div>
			</form>
		</div>
	);
}
