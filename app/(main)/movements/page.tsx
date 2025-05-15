import { getAllMovements } from "@/server/functions/movement";
import MovementList from "./_components/movement-list";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MovementsPage() {
	const movements = await getAllMovements();
	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1>MOVEMENTS</h1>
				<Link href="/movements/new" className="btn flex items-center gap-2">
					<Plus className="h-5 w-5" />
					<span>Create Movement</span>
				</Link>
			</div>

			<MovementList movements={movements} />
		</div>
	);
}
