import { Button } from "@/components/ui/button"
import { LogOut, Mail, User, Calendar } from "lucide-react"

interface ProfilePageProps {
  user: any
  onLogout: () => void
  onBrowseEvents?: () => void
}

export default function ProfilePage({ user, onLogout, onBrowseEvents }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/80">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 bg-black/20">
        <h1 className="text-3xl font-bold text-white">BookItNow</h1>
        <Button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8 flex items-center gap-2"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </header>

      {/* Main Content */}
      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-8 py-20">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full">
          {/* Profile Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-primary mb-2">Welcome, {user.name}!</h2>
        <p className="text-gray-600">Manage your bookings and event reservations</p>
          </div>

          {/* Profile Info */}
          <div className="space-y-6 mb-12">
            <div className="border-l-4 border-secondary pl-4 py-2">
              <p className="text-sm text-gray-600 mb-1">Full Name</p>
              <p className="text-xl font-semibold text-gray-800">{user.name}</p>
            </div>

            <div className="border-l-4 border-secondary pl-4 py-2">
              <p className="text-sm text-gray-600 mb-1">Email Address</p>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <p className="text-xl font-semibold text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="border-l-4 border-secondary pl-4 py-2">
              <p className="text-sm text-gray-600 mb-1">Account Type</p>
              <p className="text-xl font-semibold text-gray-800 capitalize">{user.role || "User"}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button className="bg-secondary text-primary hover:bg-secondary/90 py-6 rounded-lg font-semibold">
              <Calendar className="mr-2 h-5 w-5" />
              My Bookings
            </Button>
            <Button
              onClick={onBrowseEvents}
              className="bg-primary text-white hover:bg-primary/90 py-6 rounded-lg font-semibold"
            >
              Browse Events
            </Button>
          </div>

          {/* Logout Button */}
          <Button
            onClick={onLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-6 rounded-lg font-semibold"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>

          {/* Info Message */}
          <div className="mt-8 p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Conference Updates:</strong> You'll receive notifications about schedule changes and new speaker
              announcements via email.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
