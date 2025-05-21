import { auth } from "@/auth";
import { getLogsByUser } from "@/server/functions/log";
import { redirect } from "next/navigation";
import LogCalendarClient from "./_components/log-calendar-client"; // Import new calendar
import Link from "next/link";
import { getResultSetsById } from "@/server/functions/workout-results";
import type { Set, WorkoutResultWithWorkoutName } from "@/types";
import { Suspense } from "react";
import { formatSecondsToTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LogPage() {
	const session = await auth();

	console.log("[log/page] session", session);

	if (!session || !session?.user?.id) {
		console.log("[log/page] No user found");
		redirect("/login");
	}

	console.log(`[log/page] Fetching logs for user ${session.user.id}`);
	const logs = await getLogsByUser(session.user.id);
	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1>WORKOUT LOG</h1>
				<a href="/log/new" className="btn">
					Log New Result
				</a>
			</div>
			{/* Display recent results for now, calendar will be added here */}
			<div className="flex flex-col md:flex-row gap-4">
				<div className="mb-8 flex-1">
					<h2 className="text-xl font-semibold mb-4">RECENT RESULTS</h2>
					{/* Placeholder for recent results if needed, or remove if calendar is sufficient */}
					{logs.length > 0 ? (
						<div className="space-y-4">
							{await Promise.all(
								logs.map(async (log) => {
									return (
										<div
											key={log.id}
											className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
										>
											<div className="p-4 flex justify-between items-start">
												<div>
													<Link href={`/workouts/${log.workoutId}`}>
														<h3 className="text-xl font-bold uppercase tracking-tight hover:underline">
															{log.workoutName || "Workout"}
														</h3>
													</Link>
													<p className="text-xs font-mono text-neutral-600">
														{new Date(log.date).toLocaleDateString()}
													</p>
												</div>
												<div className="text-right text-xs font-mono">
													{log.type && (
														<p>
															<span className="font-semibold">Type:</span>{" "}
															{log.type}
														</p>
													)}
													{log.scale && (
														<p>
															<span className="font-semibold">Scale:</span>{" "}
															{log.scale.toUpperCase()}
														</p>
													)}
												</div>
											</div>

											<div className="p-4 space-y-2">
												{log.notes && (
													<div className="p-2 bg-neutral-100 border border-neutral-300">
														<p className="text-sm font-mono">{log.notes}</p>
													</div>
												)}

												<div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-mono">
													{log.wodScore && (
														<p>
															<span className="font-semibold">Score:</span>{" "}
															{log.wodScore}
														</p>
													)}
													{log.setCount && (
														<p>
															<span className="font-semibold">Sets:</span>{" "}
															{log.setCount}
														</p>
													)}
													{log.distance && (
														<p>
															<span className="font-semibold">Distance:</span>{" "}
															{log.distance}m
														</p>
													)}
													{log.time && (
														<p>
															<span className="font-semibold">Time:</span>{" "}
															{formatSecondsToTime(log.time)}
														</p>
													)}
												</div>
											</div>
											<Suspense
												fallback={
													<div className="p-4 border-t-2 border-black text-sm font-mono">
														Loading details...
													</div>
												}
											>
												<SetDetails log={log} />
											</Suspense>
										</div>
									);
								})
							)}
						</div>
					) : (
						<p>No recent results.</p>
					)}
				</div>
				<LogCalendarClient logs={logs} />
			</div>
		</div>
	);
}

async function SetDetails({ log }: { log: WorkoutResultWithWorkoutName }) {
	const setDetails: Set[] = await getResultSetsById(log.id);

	// console.log({ setDetails }); // Keep console.log commented out or remove for production

	return (
		setDetails.length > 1 && (
			<div className="p-4 border-t-2 border-black">
				<h4 className="text-sm font-bold uppercase tracking-wider mb-2">
					Set Details
				</h4>
				<ul className="space-y-1 list-none">
					{setDetails.map((set, index) => {
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
