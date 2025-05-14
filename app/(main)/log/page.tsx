"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Mock data for logged workouts
const loggedWorkouts = [
  {
    id: "1",
    date: "2023-05-10",
    workout: "Fran",
    score: "3:21",
    scale: "rx",
    notes: "Felt strong on the thrusters, struggled with the pull-ups in the final set.",
  },
  {
    id: "2",
    date: "2023-05-08",
    workout: "Back Squat",
    score: "315 lbs",
    scale: "rx",
    notes: "New PR! Form was solid throughout.",
  },
  {
    id: "3",
    date: "2023-05-05",
    workout: "Cindy",
    score: "17 rounds + 12 reps",
    scale: "rx",
    notes: "Push-ups were the limiting factor today.",
  },
  {
    id: "4",
    date: "2023-05-03",
    workout: "Running",
    score: "5000m - 22:15",
    scale: "rx",
    notes: "Steady pace throughout, felt good.",
  },
  {
    id: "5",
    date: "2023-05-01",
    workout: "Grace",
    score: "2:45",
    scale: "rx",
    notes: "Unbroken until rep 20, then singles to finish.",
  },
]

export default function LogPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>WORKOUT LOG</h1>
        <Link href="/log/new" className="btn">
          Log New Result
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="mb-4">RECENT RESULTS</h2>
          <div className="space-y-4">
            {loggedWorkouts.map((log) => (
              <div key={log.id} className="border-2 border-black p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{log.workout}</h3>
                    <p className="text-sm">{log.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{log.score}</p>
                    <span
                      className={`px-2 py-1 text-xs font-bold ${
                        log.scale === "rx"
                          ? "bg-black text-white"
                          : log.scale === "rx+"
                            ? "bg-red-500 text-white"
                            : "border border-black"
                      }`}
                    >
                      {log.scale}
                    </span>
                  </div>
                </div>
                {log.notes && (
                  <div className="border-t-2 border-black mt-2 pt-2">
                    <p className="text-sm">{log.notes}</p>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-2">
                  <button className="underline text-sm">Edit</button>
                  <button className="underline text-sm text-red-500">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="border-2 border-black">
            <div className="bg-black text-white p-4 flex justify-between items-center">
              <button onClick={prevMonth} className="text-white">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-center">
                {currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}
              </h3>
              <button onClick={nextMonth} className="text-white">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-sm mb-2">
                <div>S</div>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square border border-black flex items-center justify-center ${
                      i % 7 === 0 || i % 7 === 6 ? "bg-gray-100" : ""
                    } ${i === 9 || i === 14 || i === 18 ? "bg-red-500 text-white font-bold" : ""}`}
                  >
                    {i - 2 > 0 && i - 2 < 31 ? i - 2 : ""}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-2 border-black mt-6 p-4">
            <h3 className="mb-4">STATS THIS MONTH</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Workouts Completed</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between">
                <span>PR's Achieved</span>
                <span className="font-bold">3</span>
              </div>
              <div className="flex justify-between">
                <span>Most Common Movement</span>
                <span className="font-bold">Squats</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
