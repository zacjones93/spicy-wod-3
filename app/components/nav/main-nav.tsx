import { auth } from "@/auth";
import LogoutButton from "@/components/nav/logout-button";
import MobileNav from "@/components/nav/mobile-nav";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { Dumbbell, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function MainNav() {
	const session = await auth();
	return (
		<header className="border-b-2 border-black dark:border-dark-border p-4 bg-background dark:bg-dark-background">
			<div className="container mx-auto flex justify-between items-center">
				<Link href="/" className="flex items-center gap-2">
					<Image
						src="/spicywod-logo-black.png"
						alt="spicy wod"
						width={32}
						height={32}
						className="dark:hidden"
					/>
					<Image
						src="/spicywod-logo-white.png"
						alt="spicy wod"
						width={32}
						height={32}
						className="hidden dark:block"
					/>
					<h1 className="text-2xl font-black uppercase text-foreground dark:text-dark-foreground">
						spicy wod
					</h1>
				</Link>
				<nav className="hidden md:flex items-center gap-4">
					<DarkModeToggle />
					{session?.user ? (
						<>
							<Link
								href="/workouts"
								className="font-bold uppercase hover:underline text-foreground dark:text-dark-foreground"
							>
								Workouts
							</Link>
							<Link
								href="/movements"
								className="font-bold uppercase hover:underline text-foreground dark:text-dark-foreground"
							>
								Movements
							</Link>
							<Link
								href="/log"
								className="font-bold uppercase hover:underline text-foreground dark:text-dark-foreground"
							>
								Log
							</Link>
							<div className="border-l-2 border-black dark:border-dark-border h-6 mx-2" />
							<Link
								href="/profile"
								className="font-bold text-foreground dark:text-dark-foreground"
							>
								<User className="h-5 w-5" />
							</Link>
							<LogoutButton />
						</>
					) : (
						<div className="flex items-center gap-2">
							<Link href="/login" className="btn-outline">
								Login
							</Link>
							<Link href="/signup" className="btn">
								Sign Up
							</Link>
						</div>
					)}
				</nav>
				<MobileNav session={session} />
			</div>
		</header>
	);
}
