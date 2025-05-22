"use client";

import { useState } from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input"; // Assuming Input component is available
import { Button } from "@/components/ui/button";

export default function SpreadsheetCalculator() {
	const [oneRepMax, setOneRepMax] = useState<number | string>("");
	const [percentages, setPercentages] = useState<
		{ percentage: number; weight: number }[]
	>([]);

	const calculatePercentages = () => {
		const max = parseFloat(oneRepMax as string);
		if (isNaN(max) || max <= 0) {
			setPercentages([]);
			return;
		}

		const newPercentages = [];
		for (let i = 5; i <= 100; i += 5) {
			newPercentages.push({
				percentage: i,
				weight: parseFloat(((max * i) / 100).toFixed(2)),
			});
		}
		setPercentages(newPercentages.reverse()); // Show 100% at the top
	};

	return (
		<div className="container mx-auto p-4 max-w-screen-md">
			<h1 className="text-2xl font-bold mb-4">1RM Percentage Calculator</h1>
			<div className="flex gap-2 mb-4">
				<Input
					type="number"
					value={oneRepMax}
					onChange={(e) => setOneRepMax(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							calculatePercentages();
						}
					}}
					placeholder="Enter 1 Rep Max (kg/lb)"
					className="max-w-xs"
				/>
				<Button onClick={calculatePercentages}>Calculate</Button>
			</div>

			{percentages.length === 0 && (
				<div className="flex flex-col justify-center items-center border-2 border-black dark:border-white p-4 h-full">
					<p className="text-sm text-gray-500">
						Enter your 1RM to see the percentage breakdown.
					</p>
				</div>
			)}

			{percentages.length > 0 && (
				<Table>
					<TableCaption>Percentage breakdown of your 1RM.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Percentage</TableHead>
							<TableHead className="text-right">Weight</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{percentages.map((p) => (
							<TableRow key={p.percentage}>
								<TableCell className="font-medium">{p.percentage}%</TableCell>
								<TableCell className="text-right">{p.weight}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
