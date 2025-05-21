import { formatSecondsToTime } from "@/lib/utils";
import type { Set } from "@/types";

export function SetDetails({ sets }: { sets: Set[] | null }) {
	return (
		sets &&
		sets.length > 0 && (
			<div className="p-4 border-t-2 border-black">
				<h4 className="text-sm font-bold uppercase tracking-wider mb-2">
					Set Details
				</h4>
				<ul className="space-y-1 list-none">
					{sets.map((set, index) => {
						const setInfo = [];
						if (set.reps) {
							setInfo.push(`${set.reps} reps`);
						}
						if (set.weight !== null && set.weight !== undefined) {
							setInfo.push(`@ ${set.weight}kg`);
						}
						if (set.distance) {
							setInfo.push(`${set.distance}m`);
						}
						if (set.time) {
							setInfo.push(formatSecondsToTime(set.time));
						}
						if (set.score) {
							setInfo.push(`Score: ${set.score}`);
						}
						return (
							<li key={set.id || index} className="font-mono text-xs flex">
								<span className="w-16 shrink-0">Set {set.setNumber}:</span>
								<span className="flex-1">{setInfo.join(" / ")}</span>
								{set.notes && (
									<span className="ml-2 text-neutral-500 italic">
										({set.notes})
									</span>
								)}
							</li>
						);
					})}
				</ul>
			</div>
		)
	);
}
