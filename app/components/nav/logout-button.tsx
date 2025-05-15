"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
	return (
		<button className="font-bold" onClick={() => signOut()}>
			<LogOut className="h-5 w-5" />
		</button>
	);
}
