"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, X } from "lucide-react"

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
}

// Mock data for movements
const availableMovements = [
  { id: "1", name: "Thrusters", type: "strength" },
  { id: "2", name: "Pull-ups", type: "gymnastic" },
  { id: "3", name: "Push-ups", type: "gymnastic" },
  { id: "4", name: "Squats", type: "strength" },
  { id: "5", name: "Deadlifts", type: "strength" },
  { id: "6", name: "Box Jumps", type: "gymnastic" },
  { id: "7", name: "Wall Balls", type: "strength" },
  { id: "8", name: "Kettlebell Swings", type: "strength" },
  { id: "9", name: "Double-Unders", type: "monostructural" },
  { id: "10", name: "Running", type: "monostructural" },
]

export default function EditWorkoutPage({ params }: { params: { id: string } }) {
  const [name, setName] = useState(workout.name)
  const [description, setDescription] = useState(workout.description)
  const [scheme, setScheme] = useState(workout.scheme)
  const [selectedMovements, setSelectedMovements] = useState<string[]>(workout.movements.map((m) => m.id))
  const [tags, setTags] = useState<string[]>(workout.tags)
  const [newTag, setNewTag] = useState("")

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleMovementToggle = (movementId: string) => {
    if (selectedMovements.includes(movementId)) {
      setSelectedMovements(selectedMovements.filter((id) => id !== movementId))
    } else {
      setSelectedMovements([...selectedMovements, movementId])
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href={`/workouts/${params.id}`} className="btn-outline p-2">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1>EDIT WORKOUT</h1>
        </div>
      </div>

      <form className="border-2 border-black p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block font-bold uppercase mb-2">Workout Name</label>
              <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="block font-bold uppercase mb-2">Description</label>
              <textarea
                className="textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div>
              <label className="block font-bold uppercase mb-2">Scheme</label>
              <select className="select" value={scheme} onChange={(e) => setScheme(e.target.value)}>
                <option value="">Select a scheme</option>
                <option value="time">For Time</option>
                <option value="time-with-cap">For Time (with cap)</option>
                <option value="rounds-reps">AMRAP (Rounds + Reps)</option>
                <option value="reps">Max Reps</option>
                <option value="emom">EMOM</option>
                <option value="load">Max Load</option>
                <option value="calories">Calories</option>
                <option value="meters">Meters</option>
                <option value="pass-fail">Pass/Fail</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <button type="button" className="btn" onClick={handleAddTag}>
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div key={tag} className="flex items-center border-2 border-black px-2 py-1">
                    <span className="mr-2">{tag}</span>
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="text-red-500">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase mb-2">Movements</label>
            <div className="border-2 border-black p-4 h-[500px] overflow-y-auto">
              <div className="space-y-2">
                {availableMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className={`p-3 border-2 ${
                      selectedMovements.includes(movement.id) ? "border-black bg-black text-white" : "border-gray-300"
                    } cursor-pointer`}
                    onClick={() => handleMovementToggle(movement.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{movement.name}</span>
                      <span className="text-xs uppercase">{movement.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Link href={`/workouts/${params.id}`} className="btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
