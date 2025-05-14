"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Dumbbell } from "lucide-react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log("Signup attempt with:", { email, password, confirmPassword })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b-2 border-black p-4">
        <div className="container mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8" />
            <h1 className="text-2xl font-black uppercase">spicy wod</h1>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="border-2 border-black">
            <div className="bg-black text-white p-4">
              <h2 className="text-xl font-bold uppercase">Sign Up</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block font-bold uppercase mb-2">Email</label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase mb-2">Password</label>
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase mb-2">Confirm Password</label>
                <input
                  type="password"
                  className="input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" className="h-5 w-5" required />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline">
                    Privacy Policy
                  </Link>
                </span>
              </div>

              <button type="submit" className="btn w-full">
                Create Account
              </button>

              <div className="text-center">
                <p>
                  Already have an account?{" "}
                  <Link href="/login" className="underline font-bold">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="border-t-2 border-black p-4">
        <div className="container mx-auto">
          <p className="text-center">&copy; {new Date().getFullYear()} spicy wod. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
