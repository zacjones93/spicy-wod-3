import Link from "next/link"
import { Search, Plus, Filter } from "lucide-react"

// Mock data for workouts
const workouts = [
  {
    id: "1",
    name: "Fran",
    description: "21-15-9 reps for time of Thrusters and Pull-ups",
    scheme: "time",
    movements: ["Thrusters", "Pull-ups"],
    tags: ["benchmark", "gymnastics", "weightlifting"],
  },
  {
    id: "2",
    name: "Cindy",
    description: "AMRAP in 20 minutes of 5 Pull-ups, 10 Push-ups, 15 Squats",
    scheme: "rounds-reps",
    movements: ["Pull-ups", "Push-ups", "Squats"],
    tags: ["benchmark", "bodyweight"],
  },
  {
    id: "3",
    name: "Grace",
    description: "30 Clean & Jerks for time",
    scheme: "time",
    movements: ["Clean & Jerk"],
    tags: ["benchmark", "weightlifting"],
  },
  {
    id: "4",
    name: "Murph",
    description: "For time: 1 mile Run, 100 Pull-ups, 200 Push-ups, 300 Squats, 1 mile Run",
    scheme: "time",
    movements: ["Run", "Pull-ups", "Push-ups", "Squats"],
    tags: ["hero", "bodyweight", "endurance"],
  },
  {
    id: "5",
    name: "Karen",
    description: "150 Wall Balls for time",
    scheme: "time",
    movements: ["Wall Ball"],
    tags: ["benchmark", "monostructural"],
  },
  {
    id: "6",
    name: "DT",
    description: "5 rounds for time of: 12 Deadlifts, 9 Hang Power Cleans, 6 Push Jerks",
    scheme: "time",
    movements: ["Deadlift", "Hang Power Clean", "Push Jerk"],
    tags: ["hero", "weightlifting"],
  },
]

export default function WorkoutsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>WORKOUTS</h1>
        <Link href="/workouts/new" className="btn flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Workout
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search workouts..." className="input pl-10" />
        </div>
        <button className="btn-outline flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workouts.map((workout) => (
          <Link key={workout.id} href={`/workouts/${workout.id}`} className="card hover:bg-gray-50 transition-colors">
            <h3 className="mb-2">{workout.name}</h3>
            <p className="text-sm mb-3">{workout.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {workout.movements.map((movement) => (
                <span key={movement} className="inline-block px-2 py-1 text-xs font-bold bg-black text-white">
                  {movement}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {workout.tags.map((tag) => (
                <span key={tag} className="inline-block px-2 py-1 text-xs border border-black">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
