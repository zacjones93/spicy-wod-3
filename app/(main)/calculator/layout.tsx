"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

export default function CalculatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	return (
		<div className="flex sm:flex-row flex-col">
			<nav className="text-black dark:text-white p-4">
				<ul className="flex flex-col gap-2">
					<li
						className={`border-2 border-black dark:border-white p-2 ${
							pathname === "/calculator"
								? "bg-black text-white dark:bg-white dark:text-black"
								: ""
						}`}
					>
						<Link href="/calculator" className="">
							Calculator
						</Link>
					</li>
					<li
						className={`border-2 border-black dark:border-white p-2 ${
							pathname === "/calculator/spreadsheet"
								? "bg-black text-white dark:bg-white dark:text-black"
								: ""
						}`}
					>
						<Link href="/calculator/spreadsheet" className="">
							Percentage Spreadsheet
						</Link>
					</li>
				</ul>
			</nav>
			<Suspense fallback={<div>Loading...</div>}>
				<NuqsAdapter>
					<main className="flex-grow p-4 h-full">{children}</main>
				</NuqsAdapter>
			</Suspense>
		</div>
	);
}
