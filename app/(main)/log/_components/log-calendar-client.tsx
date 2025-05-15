"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { LogEntry } from "@/server/functions/log";
import Link from "next/link";

interface LogCalendarClientProps {
	logs: LogEntry[];
}

export default function LogCalendarClient({ logs }: LogCalendarClientProps) {
	const [date, setDate] = React.useState<Date | undefined>(new Date());
	const [selectedLog, setSelectedLog] = React.useState<LogEntry[] | null>(null);

	const handleDateSelect = (selectedDate: Date | undefined) => {
		setDate(selectedDate);
		if (selectedDate) {
			const logsForDay = logs.filter(
				(log) =>
					new Date(log.date).toDateString() === selectedDate.toDateString()
			);
			setSelectedLog(logsForDay.length > 0 ? logsForDay : null);
		} else {
			setSelectedLog(null);
		}
	};

	React.useEffect(() => {
		handleDateSelect(date);
	}, [logs, date]);

	const loggedDates = logs.map((log) => new Date(log.date));

	return (
		<div className="flex flex-col md:flex-row gap-4">
			<Calendar
				mode="single"
				selected={date}
				onSelect={handleDateSelect}
				className="rounded-md border h-fit"
				modifiers={{
					logged: loggedDates,
				}}
				modifiersStyles={{
					logged: {
						fontWeight: "bold",
						textDecoration: "underline",
						textDecorationColor: "hsl(var(--primary))",
						textDecorationThickness: "2px",
						textUnderlineOffset: "0.2em",
					},
				}}
			/>
			{selectedLog && selectedLog.length > 0 && (
				<div className="border p-4 rounded-md md:w-1/3 flex flex-col gap-4 min-w-[358px]">
					{selectedLog.map((logEntry) => (
						<div
							key={logEntry.id}
							className="border-2 border-black p-4 rounded-md"
						>
							<h3 className="font-bold text-lg mb-2">
								{logEntry.workoutName || "Workout Result"}
							</h3>
							<div className="flex justify-between items-center mb-2">
								<p className="text-sm text-muted-foreground">
									{new Date(logEntry.date).toLocaleDateString()}
								</p>
								{logEntry.scale && (
									<span className="px-2 py-1 text-xs font-bold bg-gray-200 text-black uppercase rounded-sm">
										{logEntry.scale}
									</span>
								)}
							</div>
							{logEntry.wodScore && (
								<p className="text-xl mb-1">{logEntry.wodScore}</p>
							)}
							{logEntry.time && (
								<p className="mt-1">Duration: {logEntry.time}</p>
							)}
							{logEntry.setCount && (
								<p className="mt-1">Sets: {logEntry.setCount}</p>
							)}
							{logEntry.notes && (
								<p className="text-sm text-gray-600 mt-2">{logEntry.notes}</p>
							)}
							{logEntry.workoutId && (
								<Button
									asChild
									className="mt-4 w-full bg-white text-black border border-black"
								>
									<Link href={`/workouts/${logEntry.workoutId}`}>
										View Workout
									</Link>
								</Button>
							)}
						</div>
					))}
				</div>
			)}
			{(!selectedLog || selectedLog.length === 0) && date && (
				<div className="border p-4 rounded-md md:w-1/3 min-w-[358px]">
					<h3 className="font-bold text-sm mb-2">
						No workout logged for this day.
					</h3>
					<p className="text-sm text-muted-foreground">
						{date.toLocaleDateString()}
					</p>
				</div>
			)}
      {!date && (
				<div className="border p-4 rounded-md md:w-1/3 min-w-[358px]">
					<h3 className="font-bold text-sm mb-2 text-balance w-fit">
						Select a date to view workout results.
					</h3>
				</div>
			)}
		</div>
	);
}
