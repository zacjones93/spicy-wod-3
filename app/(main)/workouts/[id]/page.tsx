"use client"

import Link from "next/link"
import { ArrowLeft, Edit, Clock, Tag, Dumbbell } from "lucide-react"

// Mock data for a single workout
const workout = {
  id: "1",
  name: "Fran",
  description: "21-15-9 reps for time of Thrusters and Pull-ups",
  scheme: "time",
  movements: [
    { id: "1", name: "Thrusters", type: "strength" },
    { id: "2", name: "Pull-ups", type: "gymnastic" },
  ],
  tags: ["benchmark", "gymnastics", "weightlifting"],
  createdAt: "2023-01-15",
  createdBy: "coach_dave",
  results: [
    { id: "1", user: "athlete_jane", date: "2023-02-10", score: "3:21", scale: "rx" },
    { id: "2", user: "athlete_john", date: "2023-02-12", score: "4:15", scale: "rx" },
    { id: "3", user: "athlete_mike", date: "2023-02-15", score: "5:30", scale: "scaled" },
  ],
}

export default function WorkoutDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href="/workouts" className="btn-outline p-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1>{workout.name}</h1>
        </div>
        <Link href={`/workouts/${params.id}/edit`} className="btn flex items-center gap-2">
          <Edit className="h-5 w-5" />
          Edit Workout
        </Link>
      </div>

      <div className="border-2 border-black mb-6">
        {/* Workout Details Section */}
        <div className="p-6 border-b-2 border-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="mb-4">DESCRIPTION</h2>
              <p className="text-lg mb-6">{workout.description}</p>

              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5" />
                <h3>SCHEME</h3>
              </div>
              <div className="border-2 border-black p-4 mb-6">
                <p className="text-lg font-bold uppercase">{workout.scheme}</p>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5" />
                <h3>TAGS</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {workout.tags.map((tag) => (
                  <span key={tag} className="inline-block px-3 py-1 border-2 border-black">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="h-5 w-5" />
                <h3>MOVEMENTS</h3>
              </div>
              <div className="space-y-4">
                {workout.movements.map((movement) => (
                  <div key={movement.id} className="border-2 border-black p-4">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold">{movement.name}</p>
                      <span className="px-2 py-1 text-xs font-bold bg-black text-white uppercase">{movement.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2>WORKOUT RESULTS</h2>
            <button className="btn">Log Result</button>
          </div>

          <table className="brutalist-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Athlete</th>
                <th>Score</th>
                <th>Scale</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workout.results.map((result) => (
                <tr key={result.id}>
                  <td>{result.date}</td>
                  <td>{result.user}</td>
                  <td className="font-bold">{result.score}</td>
                  <td>
                    <span
                      className={`px-2 py-1 text-xs font-bold ${
                        result.scale === "rx"
                          ? "bg-black text-white"
                          : result.scale === "rx+"
                            ? "bg-red-500 text-white"
                            : "border border-black"
                      }`}
                    >
                      {result.scale}
                    </span>
                  </td>
                  <td>
                    <button className="underline mr-2">View</button>
                    <button className="underline text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
