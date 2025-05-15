import { getLogsByUser } from "@/server/functions/log";
// import LogListClient from "./_components/logs-list-client"; // Comment out or remove old list
import LogCalendarClient from "./_components/log-calendar-client"; // Import new calendar
import { auth } from "@/auth";
import { getUser } from "@/server/functions/user";

export const dynamic = "force-dynamic";

export default async function LogPage() {
	let session = await auth();

	if (!session || !session?.user?.email) {
		console.log("[log/page] No user found");
		return <div>Please log in to view your workout log.</div>;
	}

	const user = await getUser(session?.user?.email);

	if (!user) {
		console.log("[log/page] No user found");
		return <div>Please log in to view your workout log.</div>;
	}

	console.log(`[log/page] Fetching logs for user ${user.id}`);
	const logs = await getLogsByUser(user.id);
	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1>WORKOUT LOG</h1>
				<a href="/log/new" className="btn">
					Log New Result
				</a>
			</div>
			{/* <LogListClient logs={logs} /> */}
			{/* Display recent results for now, calendar will be added here */}
			<div className="flex flex-col md:flex-row gap-4">
				<div className="mb-8 flex-1">
					<h2 className="text-xl font-semibold mb-4">RECENT RESULTS</h2>
					{/* Placeholder for recent results if needed, or remove if calendar is sufficient */}
					{logs.length > 0 ? (
						<div className="space-y-4">
							{logs.map((log) => (
								<div key={log.id} className="border-2 border-black p-4 rounded-md">
									<h3 className="font-bold">{log.workoutName || "Workout"}</h3>
									<p className="text-sm text-muted-foreground">
										{new Date(log.date).toLocaleDateString()}
									</p>
									<p className="mt-1">{log.notes}</p>
									{/* Add more log details here as needed */}
									{log.type && <p className="text-sm">Type: {log.type}</p>}
									{log.scale && (
										<p className="text-sm">Scale: {log.scale.toUpperCase()}</p>
									)}
									{log.wodScore && (
										<p className="text-sm">Score: {log.wodScore}</p>
									)}
									{log.setCount && (
										<p className="text-sm">Sets: {log.setCount}</p>
									)}
									{log.distance && (
										<p className="text-sm">Distance: {log.distance}m</p>
									)}
									{log.time && <p className="text-sm">Time: {log.time}s</p>}
								</div>
							))}
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
