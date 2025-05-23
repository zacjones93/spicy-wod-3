import MainNav from "@/components/nav/main-nav";
import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	metadataBase: new URL("https://spicywod.com"),
	openGraph: {
		title: "Spicy WOD", // Default title for layout
		description: "Track your spicy workouts and progress.", // Default description
		images: [
			{
				url: `/api/og?title=${encodeURIComponent("Spicy WOD")}`,
				width: 1200,
				height: 630,
				alt: "Spicy WOD",
			},
		],
	},
};

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col">
			<MainNav />

			<main className="flex-1 container mx-auto p-4">{children}</main>

			<footer className="border-t-2 border-black p-4">
				<div className="container mx-auto">
					<p className="text-center">
						&copy; {new Date().getFullYear()} spicy wod. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
