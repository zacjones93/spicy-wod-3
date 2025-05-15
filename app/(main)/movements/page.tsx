import Link from "next/link";
import { Search, Filter } from "lucide-react";
import { getAllMovements } from "@/server/functions/workout";

export default async function MovementsPage() {
	const movements = await getAllMovements();
	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1>MOVEMENTS</h1>
			</div>

			<div className="flex gap-4 mb-6">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
					<input
						type="text"
						placeholder="Search movements..."
						className="input pl-10"
					/>
				</div>
				<button className="btn-outline flex items-center gap-2">
					<Filter className="h-5 w-5" />
					Filter
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{movements.map((movement: any) => (
					<Link
						key={movement.id}
						href={`/movements/${movement.id}`}
						className="card hover:bg-gray-50 transition-colors"
					>
						<div className="flex justify-between items-center">
							<h3 className="mb-2">{movement.name}</h3>
							<span className="px-2 py-1 text-xs font-bold bg-black text-white uppercase">
								{movement.type}
							</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
