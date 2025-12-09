import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, Users, ArrowRight, Loader2, LogOut } from "lucide-react"
import { eventsAPI, type Event } from "@/lib/api"
import { motion } from "framer-motion"

interface EventListingPageProps {
  onEventSelect: (eventId: number) => void
  onProfileClick: () => void
  onLogout: () => void
  token: string
  user?: { id: number; role: string; name: string }
  onMyListingsClick?: () => void
}

export default function EventListingPage({ onEventSelect, onProfileClick, onLogout, token, user, onMyListingsClick }: EventListingPageProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await eventsAPI.getAll()
      setEvents(data)
      setFilteredEvents(data)
    } catch (err: any) {
      setError(err.message || "Failed to load events")
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = async () => {
    setLoading(true)
    try {
      const data = await eventsAPI.getAll(search, location, date)
      setFilteredEvents(data)
    } catch (err: any) {
      setError(err.message || "Failed to filter events")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSearch("")
    setLocation("")
    setDate("")
    setFilteredEvents(events)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/80">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 bg-black/20">
        <h1 className="text-3xl font-bold text-white">BookItNow Events</h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={onProfileClick}
            variant="outline"
            className="border border-white/70 text-white bg-white/10 hover:bg-white/20 rounded-full px-6"
          >
            Profile
          </Button>
          <Button
            onClick={onLogout}
            className="bg-red-600 text-white hover:bg-red-700 rounded-full px-6 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Search & Filter Section */}
      <section className="px-8 py-8 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Find Your Event</h2>
              {user?.role === 'admin' && onMyListingsClick && (
              <Button
                onClick={onMyListingsClick}
                className="bg-secondary text-primary hover:bg-secondary/90 rounded-full px-6"
              >
                My Listings
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="pl-10 rounded-lg bg-white/90 text-primary placeholder:text-gray-500 border border-white/60 shadow-sm"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Location..."
                value={location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                className="pl-10 rounded-lg bg-white/90 text-primary placeholder:text-gray-500 border border-white/60 shadow-sm"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <Input
                type="date"
                value={date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                className="pl-10 rounded-lg bg-white/90 text-primary placeholder:text-gray-500 border border-white/60 shadow-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleFilter}
                className="bg-secondary text-primary hover:bg-secondary/90 flex-1 rounded-lg"
              >
                Filter
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 rounded-lg border border-white/70 text-white bg-white/10 hover:bg-white/20"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-8">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white text-xl">No events found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Event Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="text-white text-5xl relative z-10">📍</div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-primary truncate flex-1">{event.title}</h3>
                    </div>
                    {event.creator && (
                      <p className="text-gray-500 text-xs mb-3">By {event.creator.name}</p>
                    )}

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="h-4 w-4 text-secondary" />
                        <span className="text-sm">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-4 w-4 text-secondary" />
                        <span className="text-sm">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <Users className="h-4 w-4 text-secondary" />
                        <span className="text-sm">
                          {event.available_seats} / {event.total_seats} seats available
                        </span>
                      </div>
                    </div>

                    {/* Seat Availability Bar */}
                    <div className="mb-6">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(event.available_seats / event.total_seats) * 100}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-secondary to-secondary/70"
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Starting from</p>
                        <p className="text-2xl font-bold text-secondary">${event.price}</p>
                      </div>
                      <Button
                        onClick={() => onEventSelect(event.id)}
                        className="bg-primary text-white hover:bg-primary/90 rounded-lg"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
