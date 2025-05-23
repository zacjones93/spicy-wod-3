import { auth } from "@/auth";
import { getUser } from "@/server/functions/user";
import ProfileClient from "./_components/profile-client";

import type { Metadata } from "next";

export const metadata: Metadata = {
	metadataBase: new URL("https://spicywod.com"),
	title: "Spicy WOD | Profile",
	description: "Track your spicy workouts and progress.",
	openGraph: {
		title: "Spicy WOD | Profile", // Default title for layout
		description: "Track your spicy workouts and progress.", // Default description
		images: [
			{
				url: `/api/og?title=${encodeURIComponent("Spicy WOD | Profile")}`,
				width: 1200,
				height: 630,
				alt: "Spicy WOD | Profile",
			},
		],
	},
};

export default async function ProfilePage() {
	const session = await auth();

	if (!session || !session?.user?.email) {
		console.log("[profile/page] No user found");
		return <div>Please log in to view your profile.</div>;
	}

	const user = await getUser(session.user.email);

	if (!user) {
		console.log("[profile/page] No user found");
		return <div>User not found.</div>;
	}

	return <ProfileClient user={user} />;
}
