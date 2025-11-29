"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)

    try {
      await fetch("http://localhost:8080/user/logout", {
        method: "POST",
        credentials: "include", // ⭐ required for clearing cookie
      })
    } catch (err) {
      console.error("Logout error:", err)
    }

    // Redirect user to login page
    router.push("/login")
    router.refresh() // optional: clears cached data in App Router
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 cursor-pointer"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  )
}
