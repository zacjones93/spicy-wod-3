import { auth } from "@/auth";
import LogoutButton from "@/components/nav/logout-button";
import MobileNav from "@/components/nav/mobile-nav";
import { Dumbbell, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function MainNav() {
	const session = await auth();
	return (
		<header className="border-b-2 border-black p-4">
			<div className="container mx-auto flex justify-between items-center">
				<Link href="/" className="flex items-center gap-2">
					<Image
						src="/spicwod-logo-black.png"
						alt="spicy wod"
						width={32}
						height={32}
					/>
					<h1 className="text-2xl font-black uppercase">spicy wod</h1>
				</Link>
				<nav className="hidden md:flex items-center gap-4">
					{session?.user ? (
						<>
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
							<div className="border-l-2 border-black h-6 mx-2" />
							<Link href="/profile" className="font-bold">
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
