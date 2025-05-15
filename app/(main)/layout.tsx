import type React from "react";
import Link from "next/link";
import { Dumbbell, User, LogOut } from "lucide-react";
import LogoutButton from "@/components/nav/logout-button";
import MobileNav from "@/components/nav/mobile-nav";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="border-b-2 border-black p-4">
				<div className="container mx-auto flex justify-between items-center">
					<div className="flex items-center gap-2">
						<Dumbbell className="h-8 w-8" />
						<h1 className="text-2xl font-black uppercase">spicy wod</h1>
					</div>
					<nav className="hidden md:flex items-center gap-4">
						<Link
							href="/workouts"
							className="font-bold uppercase hover:underline"
						>
							Workouts
						</Link>
						<Link
							href="/movements"
							className="font-bold uppercase hover:underline"
						>
							Movements
						</Link>
						<Link href="/log" className="font-bold uppercase hover:underline">
							Log
						</Link>
						<div className="border-l-2 border-black h-6 mx-2"></div>
						<Link href="/profile" className="font-bold">
							<User className="h-5 w-5" />
						</Link>
						<LogoutButton />
					</nav>
					<MobileNav />
				</div>
			</header>

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
