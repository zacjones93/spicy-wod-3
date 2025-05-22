import { Suspense } from "react";
import SpreadsheetCalculator from "./_components/spreadsheet-calculator";

export default function SpreadsheetPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SpreadsheetCalculator />
		</Suspense>
	);
}
