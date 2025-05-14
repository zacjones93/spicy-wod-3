"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"

// Mock data for workouts
const workouts = [
  { id: "1", name: "Fran", scheme: "time" },
  { id: "2", name: "Cindy", scheme: "rounds-reps" },
  { id: "3", name: "Grace", scheme: "time" },
  { id: "4", name: "Murph", scheme: "time" },
  { id: "5", name: "Karen", scheme: "time" },
  { id: "6", name: "DT", scheme: "time" },
]

export default function LogNewResultPage() {
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [scale, setScale] = useState("rx")

  const filteredWorkouts = workouts.filter((workout) => workout.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getSelectedWorkout = () => {
    return workouts.find((w) => w.id === selectedWorkout)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href="/log" className="btn-outline p-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1>LOG RESULT</h1>
        </div>
      </div>

      <div className="border-2 border-black p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="mb-4">SELECT WORKOUT</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search workouts..."
                className="input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="border-2 border-black h-[400px] overflow-y-auto">
              {filteredWorkouts.length > 0 ? (
                <div className="divide-y-2 divide-black">
                  {filteredWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className={`p-4 cursor-pointer ${
                        selectedWorkout === workout.id ? "bg-black text-white" : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedWorkout(workout.id)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold">{workout.name}</h3>
                        <span className="text-sm uppercase">{workout.scheme}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p>No workouts found</p>
                </div>
              )}
            </div>
          </div>

          <div>
            {selectedWorkout ? (
              <div>
                <h2 className="mb-4">LOG RESULT FOR {getSelectedWorkout()?.name}</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block font-bold uppercase mb-2">Date</label>
                    <input type="date" className="input" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>

                  <div>
                    <label className="block font-bold uppercase mb-2">Scale</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="scale"
                          value="rx"
                          checked={scale === "rx"}
                          onChange={() => setScale("rx")}
                          className="h-5 w-5"
                        />
                        <span>RX</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="scale"
                          value="rx+"
                          checked={scale === "rx+"}
                          onChange={() => setScale("rx+")}
                          className="h-5 w-5"
                        />
                        <span>RX+</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="scale"
                          value="scaled"
                          checked={scale === "scaled"}
                          onChange={() => setScale("scaled")}
                          className="h-5 w-5"
                        />
                        <span>Scaled</span>
                      </label>
                    </div>
                  </div>

                  {getSelectedWorkout()?.scheme === "time" && (
                    <div>
                      <label className="block font-bold uppercase mb-2">Time</label>
                      <div className="flex gap-2">
                        <input type="number" className="input w-20" placeholder="Min" min="0" />
                        <span className="flex items-center">:</span>
                        <input type="number" className="input w-20" placeholder="Sec" min="0" max="59" />
                      </div>
                    </div>
                  )}

                  {getSelectedWorkout()?.scheme === "rounds-reps" && (
                    <div>
                      <label className="block font-bold uppercase mb-2">Score</label>
                      <div className="flex gap-2 items-center">
                        <input type="number" className="input w-20" placeholder="Rounds" min="0" />
                        <span>rounds +</span>
                        <input type="number" className="input w-20" placeholder="Reps" min="0" />
                        <span>reps</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold uppercase mb-2">Notes</label>
                    <textarea
                      className="textarea"
                      rows={4}
                      placeholder="How did it feel? Any modifications?"
                    ></textarea>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 p-6">
                <p className="text-center text-gray-500">Select a workout from the list to log a result</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Link href="/log" className="btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn" disabled={!selectedWorkout}>
            Save Result
          </button>
        </div>
      </div>
    </div>
  )
}
