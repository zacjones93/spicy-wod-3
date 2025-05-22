"use client";
import React, { useState, useMemo, Suspense } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
// Since we are not in a Next.js environment for this immersive,
// we'll simulate Head by just letting the style tag be global.
// import Head from 'next/head'; // Not available in this environment

// --- Constants ---
const LB_PLATES_FULL = [45, 35, 25, 15, 10, 5, 2.5];
const KG_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25]; // Standard KG plates
const WARMUP_PERCENTAGES = [0.4, 0.55, 0.7, 0.8, 0.9];
const LB_TO_KG = 0.453592;
const KG_TO_LB = 2.20462;

// --- Helper Functions ---
const roundToNearestIncrement = (weight: number, increment: number): number => {
	return Math.round(weight / increment) * increment;
};

const calculatePlates = (
	targetWeight: number,
	barWeight: number,
	availablePlates: number[]
): number[] => {
	if (targetWeight <= barWeight) {
		return [];
	}
	// Ensure calculations are done with sufficient precision then rounded at the end if necessary
	let weightPerSide = (targetWeight - barWeight) / 2;
	const platesOnSide = [];
	let remaining = weightPerSide;

	// Small tolerance for floating point issues
	const tolerance = 0.0001;

	for (const plate of availablePlates) {
		while (remaining >= plate - tolerance) {
			platesOnSide.push(plate);
			remaining -= plate;
		}
	}
	return platesOnSide;
};

const getPlateColor = (weight: number, isKg: boolean): string => {
	// Standard Olympic Plate Colors
	if (isKg) {
		switch (weight) {
			case 25:
				return "#FF0000"; // Red
			case 20:
				return "#0000FF"; // Blue
			case 15:
				return "#FFFF00"; // Yellow
			case 10:
				return "#00FF00"; // Green
			case 5:
				return "#FFFFFF"; // White
			case 2.5:
				return "#000000"; // Black
			case 1.25:
				return "#808080"; // Grey/Chrome
			default:
				return "#7f8c8d"; // Default Grey
		}
	} else {
		// LB Plates - common gym colors
		switch (weight) {
			case 45:
				return "#0000FF"; // Blue
			case 35:
				return "#FFFF00"; // Yellow (less common, but for consistency)
			case 25:
				return "#00FF00"; // Green
			case 15:
				return "#FFA500"; // Orange (often not a standard color, using for distinction)
			case 10:
				return "#FFFFFF"; // White
			case 5:
				return "#FF0000"; // Red
			case 2.5:
				return "#000000"; // Black
			default:
				return "#7f8c8d"; // Default Grey
		}
	}
};

const getPlateTextColor = (backgroundColor: string | null): string => {
	// Determine if text should be black or white based on background
	if (!backgroundColor) return "#000";
	const hex = backgroundColor.replace("#", "");
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

const getPlateDimensions = (
	weight: number
): { height: number; width: number } => {
	const baseHeight = 100; // px
	const baseWidth = 18; // px, increased for better visibility
	const minHeight = baseHeight * 0.4;
	const minWidth = baseWidth * 0.5;

	if (weight >= 45 || weight >= 25)
		return { height: baseHeight, width: baseWidth * 1.5 }; // 45lb or 25kg
	if (weight >= 35 || weight >= 20)
		return { height: baseHeight * 0.95, width: baseWidth * 1.4 }; // 35lb or 20kg
	if (weight >= 25 || weight >= 15)
		return { height: baseHeight * 0.9, width: baseWidth * 1.3 }; // 25lb or 15kg (note: 25lb is distinct from 25kg)
	if (weight >= 15) return { height: baseHeight * 0.8, width: baseWidth * 1.2 }; // 15lb
	if (weight >= 10) return { height: baseHeight * 0.7, width: baseWidth * 1.1 }; // 10lb or 10kg
	if (weight >= 5) return { height: baseHeight * 0.6, width: baseWidth }; // 5lb or 5kg
	if (weight >= 2.5)
		return { height: baseHeight * 0.5, width: baseWidth * 0.8 }; // 2.5lb or 2.5kg
	if (weight >= 1.25)
		return { height: baseHeight * 0.4, width: baseWidth * 0.7 }; // 1.25kg
	return { height: minHeight, width: minWidth };
};

// --- React Components ---

const Plate = ({ weight, isKg }: { weight: number; isKg: boolean }) => {
	const { height, width } = getPlateDimensions(weight);
	const color = getPlateColor(weight, isKg);
	const textColor = getPlateTextColor(color);

	return (
		<div
			className="border-2 border-black flex items-center justify-center font-bold text-xs mx-px text-center"
			style={{
				height: `${height}px`,
				width: `${width}px`,
				backgroundColor: color,
				color: textColor,
			}}
		>
			{weight}
		</div>
	);
};

const BarbellGraphic = ({
	plates,
	isKg,
}: {
	plates: number[];
	isKg: boolean;
}) => {
	return (
		<div className="flex items-center justify-center min-h-[150px] p-5 border-3 border-black my-5 overflow-x-auto relative w-full">
			{/* Left Collar */}
			<div
				className="w-2.5 bg-neutral-600 border border-neutral-800 rounded-sm mr-0.5 z-10"
				style={{
					height: `${getPlateDimensions(isKg ? 2.5 : 5).height * 0.3}px`,
				}}
			></div>
			<div className="flex flex-row-reverse items-center">
				{plates.map((plate: number, index: number) => (
					<Plate key={`left-${index}-${plate}`} weight={plate} isKg={isKg} />
				))}
			</div>
			{/* Bar */}
			<div className="h-3 min-w-[50px] flex-grow max-w-[600px] bg-neutral-400 border-l-5 border-r-5 border-neutral-500 relative z-0"></div>
			<div className="flex items-center">
				{plates.map((plate: number, index: number) => (
					<Plate key={`right-${index}-${plate}`} weight={plate} isKg={isKg} />
				))}
			</div>
			{/* Right Collar */}
			<div
				className="w-2.5 bg-neutral-600 border border-neutral-800 rounded-sm ml-0.5 z-10"
				style={{
					height: `${getPlateDimensions(isKg ? 2.5 : 5).height * 0.3}px`,
				}}
			></div>
		</div>
	);
};

const WarmupSet = ({
	setNumber,
	weight,
	plates,
	unit,
	isKg,
}: {
	setNumber: number;
	weight: number;
	plates: number[];
	unit: string;
	isKg: boolean;
}) => (
	<div className="border-2 border-black p-3.5 mb-2.5 ">
		<h4 className="mt-0 mb-2.5 pb-1.25 border-b border-black text-lg text-black dark:text-black">
			Set {setNumber}: {weight.toFixed(1)}
			{unit} {/* Using toFixed for consistent display */}
		</h4>
		<div className="flex flex-wrap gap-1.25 items-center">
			{plates.length > 0 ? (
				plates.map((p: number, i: number) => (
					<span
						key={i}
						className="py-0.5 px-2 rounded-sm text-sm border border-black font-bold"
						style={{
							backgroundColor: getPlateColor(p, isKg),
							color: getPlateTextColor(getPlateColor(p, isKg)),
						}}
					>
						{p}
					</span>
				))
			) : (
				<span className="italic">Just the bar!</span>
			)}
		</div>
	</div>
);

export default function BarbellCalculator() {
	const [targetWeightQuery, setTargetWeightQuery] = useQueryState(
		"weight",
		parseAsInteger.withDefault(135)
	);
	const [units, setUnits] = useQueryState(
		"units",
		parseAsString.withDefault("lb")
	);
	const [barWeightOption, setBarWeightOption] = useQueryState(
		"bar",
		parseAsInteger.withDefault(45) // This is always in LB as per UI
	);

	// Local state for the input field to allow typing before submission
	const [inputWeight, setInputWeight] = useState<string>(
		targetWeightQuery.toString()
	);

	const isKg = units === "kg";
	// Bar weight in the currently selected unit system
	const actualBarWeight = isKg
		? roundToNearestIncrement(barWeightOption * LB_TO_KG, 1.25)
		: barWeightOption;
	const availablePlates = isKg ? KG_PLATES : LB_PLATES_FULL;
	const displayUnit = isKg ? "kg" : "lb";

	// Target weight in the currently selected unit system
	const currentDisplayTargetWeight = isKg
		? roundToNearestIncrement(targetWeightQuery * LB_TO_KG, 2.5) // If input was LB, convert to KG
		: targetWeightQuery; // If input was KG, it's already in LB by query (or if it's LB, it's LB)

	// This ensures that if the unit is KG, the targetWeightQuery (which is always stored as if it were LB)
	// is converted to KG for display and calculation.
	const effectiveTargetWeightForCalc = isKg
		? roundToNearestIncrement(targetWeightQuery * LB_TO_KG, 2.5)
		: targetWeightQuery;

	const platesPerSide = useMemo(() => {
		return calculatePlates(
			effectiveTargetWeightForCalc,
			actualBarWeight,
			availablePlates
		);
	}, [effectiveTargetWeightForCalc, actualBarWeight, availablePlates]);

	const warmupSets = useMemo(() => {
		// Warmup calculations should be based on the *intended* target weight in its original unit system.
		// The targetWeightQuery is always the "LB equivalent" or the direct LB value.
		const baseTargetLb = targetWeightQuery; // This is the value entered, treated as LB or converted to LB if KG was selected.
		const barWeightLb = barWeightOption; // Always use the selected LB bar weight for percentage base

		return WARMUP_PERCENTAGES.map((perc, index) => {
			let warmupWeightLb = roundToNearestIncrement(baseTargetLb * perc, 5); // Calculate warmup in LBs
			if (warmupWeightLb < barWeightLb) warmupWeightLb = barWeightLb;

			let displayWarmupWeight;
			let platesForWarmup;
			let barForWarmupCalc;

			if (isKg) {
				displayWarmupWeight = roundToNearestIncrement(
					warmupWeightLb * LB_TO_KG,
					1.25
				); // Convert to KG for display
				barForWarmupCalc = roundToNearestIncrement(
					barWeightLb * LB_TO_KG,
					1.25
				);
				platesForWarmup = calculatePlates(
					displayWarmupWeight,
					barForWarmupCalc,
					KG_PLATES
				);
			} else {
				displayWarmupWeight = warmupWeightLb;
				barForWarmupCalc = barWeightLb;
				platesForWarmup = calculatePlates(
					displayWarmupWeight,
					barForWarmupCalc,
					LB_PLATES_FULL
				);
			}

			return {
				setNumber: index + 1,
				weight: displayWarmupWeight,
				plates: platesForWarmup,
			};
		});
	}, [
		targetWeightQuery,
		barWeightOption,
		isKg,
		actualBarWeight,
		availablePlates,
	]);

	const handleWeightSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const newWeight = parseInt(inputWeight, 10);
		if (!isNaN(newWeight) && newWeight > 0) {
			// Store the raw input. If units are KG, it will be converted for display/calc.
			// If units are LB, it's used directly.
			// nuqs will store this value.
			setTargetWeightQuery(newWeight);
			console.log("INFO: Target weight submitted", newWeight);
		} else {
			// Reset input to current query if invalid
			setInputWeight(targetWeightQuery.toString());
			console.warn("WARN: Invalid weight input, resetting to current query");
		}
	};

	// Update input field if query param changes (e.g. back button)
	React.useEffect(() => {
		setInputWeight(targetWeightQuery.toString());
		console.log("DEBUG: inputWeight synced with targetWeightQuery");
	}, [targetWeightQuery]);

	return (
		<>
			{/* <Head> is not available here, so styles are applied globally or inline */}

			<div className="font-mono max-w-2xl mx-auto border-4 border-black bg-white shadow-[8px_8px_0px_#000]">
				<h1 className="text-center border-b-3 border-black pb-2.5 mb-5 text-4xl tracking-wider text-black dark:text-black">
					BARBELL CALCULATOR
				</h1>

				<form
					onSubmit={handleWeightSubmit}
					className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3.5 mb-6 border-3 border-black p-3.5 "
				>
					<div className="flex flex-col">
						<label
							htmlFor="weightInput"
							className="font-bold mb-2 text-base text-black dark:text-black"
						>
							TARGET WEIGHT:
						</label>
						<input
							id="weightInput"
							type="number"
							value={inputWeight}
							onChange={(e) => setInputWeight(e.target.value)}
							className="p-2.5 border-2 border-black text-lg bg-white w-full box-border rounded-none dark:text-black"
							required
							min="0"
						/>
					</div>
					<div className="flex flex-row gap-4">
						<div className="flex flex-col h-full">
							<label className="font-bold mb-2 text-base text-black dark:text-black">
								UNITS:
							</label>
							<div className="flex gap-2.5 border-2 border-black p-2 bg-white rounded-none h-full justify-center items-center">
								<label
									className={`cursor-pointer border-2 border-black py-1 px-2.5 bg-gray-300 text-black dark:text-black text-sm rounded-none flex-1 text-center ${
										units === "lb" ? "bg-black text-black dark:text-black" : ""
									}`}
								>
									<input
										type="radio"
										name="units"
										value="lb"
										checked={units === "lb"}
										onChange={() => setUnits("lb")}
										className="hidden"
									/>
									LB
								</label>
								<label
									className={`cursor-pointer border-2 border-black py-1 px-2.5 bg-gray-300 text-black dark:text-black text-sm rounded-none flex-1 text-center ${
										units === "kg" ? "bg-black text-black" : ""
									}`}
								>
									<input
										type="radio"
										name="units"
										value="kg"
										checked={units === "kg"}
										onChange={() => setUnits("kg")}
										className="hidden"
									/>
									KG
								</label>
							</div>
						</div>

						<div className="flex flex-col w-full">
							<label className="font-bold mb-2 text-base text-black dark:text-black">
								BAR (LB):
							</label>
							<div className="flex gap-2.5 border-2 border-black p-2 bg-white rounded-none">
								<label
									className={`cursor-pointer border-2 border-black py-1 px-2.5 bg-gray-300 text-black dark:text-black text-sm rounded-none flex-1 text-center ${
										barWeightOption === 45 ? "bg-black text-black" : ""
									}`}
								>
									<input
										type="radio"
										name="bar"
										value={45}
										checked={barWeightOption === 45}
										onChange={() => setBarWeightOption(45)}
										className="hidden"
									/>
									45 lb
								</label>
								<label
									className={`cursor-pointer border-2 border-black py-1 px-2.5 bg-gray-300 text-black dark:text-black text-sm rounded-none flex-1 text-center ${
										barWeightOption === 35 ? "bg-black text-black" : ""
									}`}
								>
									<input
										type="radio"
										name="bar"
										value={35}
										checked={barWeightOption === 35}
										onChange={() => setBarWeightOption(35)}
										className="hidden"
									/>
									35 lb
								</label>
							</div>
						</div>
					</div>

					<button
						type="submit"
						className="py-2.5 px-3.5 border-3 border-black bg-black text-white dark:text-white text-lg font-bold cursor-pointer shadow-[3px_3px_0px_#000] transition-all duration-100 ease-in-out col-span-full text-center rounded-none active:shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
					>
						Calculate
					</button>
				</form>

				<div className="text-center text-4xl font-bold  p-3.5 border-3 border-black mb-5 text-black dark:text-black">
					{effectiveTargetWeightForCalc.toFixed(1)}
					<small className="text-[0.4em] ml-1.25 align-middle">
						{displayUnit.toUpperCase()}
					</small>
				</div>

				<BarbellGraphic plates={platesPerSide} isKg={isKg} />

				<div className="border-3 border-black p-3.5 mt-6">
					<h3 className="text-center border-b-2 border-black pb-2 mb-3.5 text-xl text-black dark:text-black">
						WARM-UP PROTOCOL
					</h3>
					{warmupSets.map((set) => (
						<WarmupSet
							key={set.setNumber}
							setNumber={set.setNumber}
							weight={set.weight}
							plates={set.plates}
							unit={displayUnit}
							isKg={isKg}
						/>
					))}
				</div>
				<div className="text-center text-xs mt-5 text-neutral-500 border-t border-neutral-500 pt-2.5">
					Spicy WOD - Barbell Calculator
				</div>
			</div>
		</>
	);
}
