"use client";

import { useState } from "react";

export default function LogListClient({ logs }: { logs: any[] }) {
	// Optionally: implement month navigation in the future
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div className="lg:col-span-2">
				<h2 className="mb-4">RECENT RESULTS</h2>
				<div className="space-y-4">
					{logs.length === 0 && <div>No logs found.</div>}
					{logs.map((log) => (
						<div key={log.id} className="border-2 border-black p-4">
							<div className="flex justify-between items-start mb-2">
								<div>
									<h3 className="text-xl font-bold">
										{log.workout || "Unknown Workout"}
									</h3>
									<p className="text-sm">
										{new Date(log.date).toLocaleDateString()}
									</p>
								</div>
								<div className="text-right">
									<p className="text-xl font-bold">{log.wodScore}</p>
									<span
										className={`px-2 py-1 text-xs font-bold ${
											log.scale === "rx"
												? "bg-black text-white"
												: log.scale === "rx+"
												? "bg-red-500 text-white"
												: "border border-black"
										}`}
									>
										{log.scale}
									</span>
								</div>
							</div>
							{log.notes && (
								<div className="border-t-2 border-black mt-2 pt-2">
									<p className="text-sm">{log.notes}</p>
								</div>
							)}
							<div className="flex justify-end gap-2 mt-2">
								<button className="underline text-sm">Edit</button>
								<button className="underline text-sm text-red-500">
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
			{/* Calendar and stats can be added here in the future */}
		</div>
	);
}
