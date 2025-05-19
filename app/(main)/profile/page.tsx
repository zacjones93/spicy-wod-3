import { auth } from "@/auth";
import { getUser } from "@/server/functions/user";
import ProfileClient from "./_components/profile-client";

export const dynamic = "force-dynamic";

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
