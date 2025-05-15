"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Dumbbell, User, LogOut } from "lucide-react";
import LogoutButton from "@/components/nav/logout-button";
import { SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function MobileNav() {
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
						href="#"
						className="flex items-center gap-2 text-lg font-semibold mb-4"
					>
						<Dumbbell className="h-6 w-6" />
						<span>spicy wod</span>
					</Link>
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
				</nav>
			</SheetContent>
		</Sheet>
	);
}
