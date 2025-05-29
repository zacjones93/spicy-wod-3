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
		<header className="border-black border-b-2 bg-background p-4 dark:border-dark-border dark:bg-dark-background">
			<div className="container mx-auto flex items-center justify-between">
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
					<h1 className="font-black text-2xl text-foreground uppercase dark:text-dark-foreground">
						spicy wod
					</h1>
				</Link>
				<nav className="hidden items-center gap-4 md:flex">
					{session?.user ? (
						<>
							<Link
								href="/workouts"
								className="font-bold text-foreground uppercase hover:underline dark:text-dark-foreground"
							>
								Workouts
							</Link>
							<Link
								href="/movements"
								className="font-bold text-foreground uppercase hover:underline dark:text-dark-foreground"
							>
								Movements
							</Link>
							<Link
								href="/log"
								className="font-bold text-foreground uppercase hover:underline dark:text-dark-foreground"
							>
								Log
							</Link>
							<Link
								href="/calculator"
								className="font-bold text-foreground uppercase hover:underline dark:text-dark-foreground"
							>
								Calculator
							</Link>
							<div className="mx-2 h-6 border-black border-l-2 dark:border-dark-border" />
							<Link
								href="/profile"
								className="font-bold text-foreground dark:text-dark-foreground"
							>
								<User className="h-5 w-5" />
							</Link>
							<DarkModeToggle />
							<LogoutButton />
						</>
					) : (
						<div className="flex items-center gap-2">
							<Link
								href="/calculator"
								className="font-bold text-foreground uppercase hover:underline dark:text-dark-foreground"
							>
								Calculator
							</Link>
							<Link href="/login" className="btn-outline">
								Login
							</Link>
							<Link href="/signup" className="btn">
								Sign Up
							</Link>
							<DarkModeToggle />
						</div>
					)}
				</nav>
				<MobileNav session={session} />
			</div>
		</header>
	);
}
