"use client";

import { Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface WorkoutControlsProps {
	allTags: string[];
	allMovements: string[];
}

export default function WorkoutControls({
	allTags,
	allMovements,
}: WorkoutControlsProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [searchTerm, setSearchTerm] = useState(
		searchParams.get("search") || ""
	);
	const [selectedTag, setSelectedTag] = useState(searchParams.get("tag") || "");
	const [selectedMovement, setSelectedMovement] = useState(
		searchParams.get("movement") || ""
	);

	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());
		if (searchTerm) {
			params.set("search", searchTerm);
		} else {
			params.delete("search");
		}

		if (selectedTag) {
			params.set("tag", selectedTag);
		} else {
			params.delete("tag");
		}

		if (selectedMovement) {
			params.set("movement", selectedMovement);
		} else {
			params.delete("movement");
		}

		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	}, [
		searchTerm,
		selectedTag,
		selectedMovement,
		router,
		pathname,
		searchParams,
	]);

	return (
		<div className="flex flex-col sm:flex-row gap-4 mb-6">
			<div className="relative flex-1">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
				<input
					type="text"
					placeholder="Search workouts..."
					className="input pl-10 w-full"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
			<div className="flex gap-4">
				<select
					className="input w-full sm:w-auto"
					value={selectedTag}
					onChange={(e) => setSelectedTag(e.target.value)}
				>
					<option value="">All Tags</option>
					{allTags.map((tag) => (
						<option key={tag} value={tag}>
							{tag}
						</option>
					))}
				</select>
				<select
					className="input w-full sm:w-auto"
					value={selectedMovement}
					onChange={(e) => setSelectedMovement(e.target.value)}
				>
					<option value="">All Movements</option>
					{allMovements.map((movement) => (
						<option key={movement} value={movement}>
							{movement}
						</option>
					))}
				</select>
			</div>
			{/* The Filter button is currently not used for modal functionality */}
			{/* <button className="btn-outline flex items-center gap-2">
				<Filter className="h-5 w-5" />
				Filter
			</button> */}
		</div>
	);
}
