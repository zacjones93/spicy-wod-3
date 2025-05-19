"use client";

import LogoutButton from "@/components/nav/logout-button";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Dumbbell, Menu, User } from "lucide-react";
import type { Session } from "next-auth";
import Link from "next/link";

interface MobileNavProps {
	session: Session | null;
}

export default function MobileNav({ session }: MobileNavProps) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className="md:hidden">
					<Menu className="h-6 w-6" />
					<span className="sr-only">Toggle navigation menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="bg-white">
				<VisuallyHidden>
					<SheetTitle>Navigation Menu</SheetTitle>
				</VisuallyHidden>
				<nav className="grid gap-6 text-lg font-medium">
					<Link
						href="/"
						className="flex items-center gap-2 text-lg font-semibold mb-4"
					>
						<Dumbbell className="h-6 w-6" />
						<span>spicy wod</span>
					</Link>
					{session?.user ? (
						<>
							<Link href="/workouts" className="hover:text-primary">
								Workouts
							</Link>
							<Link href="/movements" className="hover:text-primary">
								Movements
							</Link>
							<Link href="/log" className="hover:text-primary">
								Log
							</Link>
							<hr className="my-2" />
							<Link href="/profile" className="hover:text-primary">
								<div className="flex items-center gap-2">
									<User className="h-5 w-5" />
									<span>Profile</span>
								</div>
							</Link>
							<LogoutButton />
						</>
					) : (
						<>
							<Link href="/login" className="hover:text-primary">
								Login
							</Link>
							<Link href="/signup" className="hover:text-primary">
								Sign Up
							</Link>
						</>
					)}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
