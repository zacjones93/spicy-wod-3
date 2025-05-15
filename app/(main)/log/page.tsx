import { getLogsByUser } from "@/server/functions/log";
import LogListClient from "./_components/logs-list-client";
import { auth } from "@/auth";
import { getUser } from "@/server/functions/user";

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
			<LogListClient logs={logs} />
		</div>
	);
}
