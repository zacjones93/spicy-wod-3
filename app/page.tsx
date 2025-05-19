import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { getLatestWorkout } from "@/server/functions/workout";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import MainNav from "./components/nav/main-nav";

export default async function Home() {
	const session = await auth();

	const latestWorkout = await getLatestWorkout();
	return (
		<div className="min-h-screen flex flex-col">
			<header>
				<div >
					<nav>
						{session?.user ? (
							<MainNav />
						) : (
							<div className="container mx-auto flex justify-between items-center">
								<div className="flex items-center gap-2">
									<Dumbbell className="h-8 w-8" />
									<h1 className="text-2xl font-black uppercase">spicy wod</h1>
								</div>
								<Link href="/login" className="btn-outline mr-2">
									Login
								</Link>
								<Link href="/signup" className="btn">
									Sign Up
								</Link>
							</div>
						)}
					</nav>
				</div>
			</header>

			<main className="flex-1">
				<section className="py-20 border-b-2 border-black">
					<div className="container mx-auto px-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="flex flex-col justify-center">
								<h1 className="text-6xl mb-6">
									BRUTAL WORKOUTS.
									<br />
									SIMPLE TRACKING.
								</h1>
								<p className="text-xl mb-8">
									Create, view, and edit CrossFit-style workouts with a fast,
									minimal interface that never gets in your way.
								</p>
								<div>
									<Link href="/signup" className="btn text-xl py-3 px-8 mr-4">
										Get Started
									</Link>
									<Link
										href="/workouts"
										className="btn-outline text-xl py-3 px-8"
									>
										Browse Workouts
									</Link>
								</div>
							</div>
							<div className="border-2 border-black p-8 bg-red-500 text-white">
								<h2 className="text-3xl font-black mb-4">WORKOUT OF THE DAY</h2>
								<div className="border-2 border-white p-4 mb-4">
									{!latestWorkout && <p>No workouts found.</p>}
									{latestWorkout && (
										<>
											<h3 className="text-xl font-bold mb-2">
												{latestWorkout.name}
											</h3>
											<p className="mb-2 whitespace-pre-wrap">
												{latestWorkout.description}
											</p>
											{latestWorkout.movements &&
												latestWorkout.movements.length > 0 && (
													<ul className="list-disc pl-5 mb-4">
														{latestWorkout.movements.map((m: any) => (
															<li key={m.id}>{m.name}</li>
														))}
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
									className="inline-block px-4 py-2 font-bold uppercase bg-white text-black border-2 border-white hover:bg-transparent hover:text-white transition-colors"
								>
									View All Workouts
								</Link>
							</div>
						</div>
					</div>
				</section>

				<section className="py-16">
					<div className="container mx-auto px-4">
						<h2 className="text-3xl font-black mb-8 text-center">
							HOW IT WORKS
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div className="border-2 border-black p-6">
								<h3 className="text-xl font-bold mb-4">CREATE</h3>
								<p>
									Build custom workouts with our simple, explicit interface. Add
									movements, set schemes, and tag appropriately.
								</p>
							</div>
							<div className="border-2 border-black p-6">
								<h3 className="text-xl font-bold mb-4">TRACK</h3>
								<p>
									Log your results with a clean, fast interface. Track progress
									over time with our brutalist, no-nonsense design.
								</p>
							</div>
							<div className="border-2 border-black p-6">
								<h3 className="text-xl font-bold mb-4">IMPROVE</h3>
								<p>
									Analyze your performance with our grid-based result views. See
									what works, what doesn&apos;t, and crush your next WOD.
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>

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
