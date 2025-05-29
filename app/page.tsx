import { auth } from "@/auth";
import { getLatestWorkout } from "@/server/functions/workout";
import Link from "next/link";
import MainNav from "./components/nav/main-nav";

import type { Movement } from "@/types/movement";
import type { Metadata } from "next";

export const metadata: Metadata = {
	metadataBase: new URL("https://spicywod.com"),
	title: "Spicy WOD",
	description: "Track your spicy workouts and progress.",
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

export default async function Home() {
	const session = await auth();

	const latestWorkout = await getLatestWorkout();
	return (
		<div className="flex min-h-screen flex-col">
			<header>
				<div>
					<MainNav />
				</div>
			</header>

			<main className="flex-1">
				<section className="border-black border-b-2 py-20">
					<div className="container mx-auto px-4">
						<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
							<div className="flex flex-col justify-center">
								<h1 className="mb-6 text-6xl">
									BRUTAL WORKOUTS.
									<br />
									SIMPLE TRACKING.
								</h1>
								<p className="mb-8 text-xl">
									Create, view, and edit CrossFit-style workouts with a fast,
									minimal interface that never gets in your way.
								</p>
								<div>
									<Link href="/signup" className="btn mr-4 px-8 py-3 text-xl">
										Get Started
									</Link>
									<Link
										href="/workouts"
										className="btn-outline px-8 py-3 text-xl"
									>
										Browse Workouts
									</Link>
								</div>
							</div>
							<div className="border-2 border-black bg-red-500 p-8 text-white">
								<h2 className="mb-4 font-black text-3xl">WORKOUT OF THE DAY</h2>
								<div className="mb-4 border-2 border-white p-4">
									{!latestWorkout && <p>No workouts found.</p>}
									{latestWorkout && (
										<>
											<h3 className="mb-2 font-bold text-xl">
												{latestWorkout.name}
											</h3>
											<p className="mb-2 whitespace-pre-wrap">
												{latestWorkout.description}
											</p>
											{latestWorkout.movements &&
												latestWorkout.movements.length > 0 && (
													<ul className="mb-4 list-disc pl-5">
														{latestWorkout.movements.map(
															(m: Movement) => (
																<li key={m.id}>{m.name}</li>
															),
														)}
													</ul>
												)}
											{latestWorkout.scheme && (
												<p className="text-sm">
													Scheme: {latestWorkout.scheme}
												</p>
											)}
										</>
									)}
								</div>
								<Link
									href="/workouts"
									className="inline-block border-2 border-white bg-white px-4 py-2 font-bold text-black uppercase transition-colors hover:bg-transparent hover:text-white"
								>
									View All Workouts
								</Link>
							</div>
						</div>
					</div>
				</section>

				<section className="py-16">
					<div className="container mx-auto px-4">
						<h2 className="mb-8 text-center font-black text-3xl">HOW IT WORKS</h2>
						<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
							<div className="border-2 border-black p-6">
								<h3 className="mb-4 font-bold text-xl">CREATE</h3>
								<p>
									Build custom workouts with our simple, explicit interface. Add
									movements, set schemes, and tag appropriately.
								</p>
							</div>
							<div className="border-2 border-black p-6">
								<h3 className="mb-4 font-bold text-xl">TRACK</h3>
								<p>
									Log your results with a clean, fast interface. Track progress
									over time with our brutalist, no-nonsense design.
								</p>
							</div>
							<div className="border-2 border-black p-6">
								<h3 className="mb-4 font-bold text-xl">IMPROVE</h3>
								<p>
									Analyze your performance with our grid-based result views. See
									what works, what doesn&apos;t, and crush your next WOD.
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>

			<footer className="border-black border-t-2 p-4">
				<div className="container mx-auto">
					<p className="text-center">
						&copy; {new Date().getFullYear()} spicy wod. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
