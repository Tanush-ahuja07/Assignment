import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { usersAPI, type User } from "@/lib/api"
import { Loader2, LogOut, User as UserIcon, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

interface AdminUsersProps {
  token: string
  onBack: () => void
  onLogout: () => void
  onProfileClick?: () => void
  onEventsClick?: () => void
}

export default function AdminUsers({ token, onBack, onLogout, onProfileClick, onEventsClick }: AdminUsersProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await usersAPI.getAll(token)
      setUsers(data)
    } catch (err: any) {
      setError(err.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleMakeAdmin = async (userId: number) => {
    setError("")
    try {
      await usersAPI.makeAdmin(token, userId)
      setSuccessMessage("Role updated to admin")
      fetchUsers()
      setTimeout(() => setSuccessMessage(""), 2000)
    } catch (err: any) {
      setError(err.message || "Failed to update role")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/80">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-8 py-6 bg-black/20">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="border border-white/70 text-white bg-white/10 hover:bg-white/20 rounded-full px-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3 justify-start md:justify-end">
          {onEventsClick && (
            <Button
              onClick={onEventsClick}
              variant="outline"
              className="border border-white/70 text-white bg-white/10 hover:bg-white/20 rounded-full px-6"
            >
              Events
            </Button>
          )}
          {onProfileClick && (
            <Button
              onClick={onProfileClick}
              variant="outline"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 px-6"
            >
              <UserIcon className="h-4 w-4" />
              Profile
            </Button>
          )}
          <Button
            onClick={onLogout}
            className="bg-red-600 text-white hover:bg-red-700 rounded-full px-6 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <section className="px-8 py-10">
        <div className="max-w-5xl mx-auto">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 text-green-600 px-6 py-4 rounded-lg mb-6"
            >
              {successMessage}
            </motion.div>
          )}

          {loading ? (
            <div className="flex items-center gap-2 text-white">
              <Loader2 className="h-6 w-6 animate-spin" />
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <p className="text-white">No users found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white/90 border border-gray-100 rounded-xl px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-primary">{u.name || 'Unnamed User'}</p>
                    <p className="text-xs text-gray-600">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs px-3 py-1 rounded-full ${u.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                      {u.role}
                    </span>
                    <Button
                      size="sm"
                      disabled={u.role === 'admin'}
                      onClick={() => handleMakeAdmin(u.id)}
                      className="bg-secondary text-primary hover:bg-secondary/90 rounded-full px-4 disabled:opacity-60"
                    >
                      Make Admin
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
