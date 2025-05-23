import { auth } from "@/auth";
import { getWorkoutById } from "@/server/functions/workout";
import {
	getResultSetsById,
	getWorkoutResultsByWorkoutAndUser,
} from "@/server/functions/workout-results";
import { redirect } from "next/navigation";
import WorkoutDetailClient from "./_components/workout-detail-client";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id
 
  // fetch post information

  const workout = await getWorkoutById(id)

  if (!workout) {
    return {
      title: "workout not found",
      description: "workout not found",
    }
  }

  return {
    title: `Spicy WOD | ${workout.name}`,
    description: `Spicy WOD | ${workout.name}`,
		openGraph: {
			title: `Spicy WOD | ${workout.name}`,
			description: `Spicy WOD | ${workout.name}`,
			images: [
				{
					url: `/api/og?title=${encodeURIComponent(`Spicy WOD | ${workout.name}`)}`,
					width: 1200,		
					height: 630,
					alt: `Spicy WOD | ${workout.name}`,
				},
			],
		},
  }
}

export default async function WorkoutDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const myParams = await params;
	const workout = await getWorkoutById(myParams.id);

	const session = await auth();

	if (!session?.user?.id) {
		console.log("[log/page] No user found");
		redirect("/login");
	}

	if (!workout) return <div>Workout not found.</div>;

	const results = await getWorkoutResultsByWorkoutAndUser(
		myParams.id,
		session?.user?.id
	);

	const resultsWithSets = await (async () => {
		if (
			!workout?.roundsToScore ||
			workout.roundsToScore <= 1 ||
			results.length === 0
		) {
			return results.map((result) => ({ ...result, sets: null }));
		}

		const allSetsPromises = results.map(async (result) => {
			const sets = await getResultSetsById(result.id);
			return { ...result, sets: sets && sets.length > 0 ? sets : null };
		});

		return Promise.all(allSetsPromises);
	})();

	return (
		<WorkoutDetailClient
			userId={session?.user?.id}
			workout={workout}
			workoutId={myParams.id}
			resultsWithSets={resultsWithSets}
		/>
	);
}
