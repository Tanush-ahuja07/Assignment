import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Calendar,
  MapPin,
  User,
} from "lucide-react"
import { eventsAPI, type Event } from "@/lib/api"
import { motion } from "framer-motion"

interface AdminDashboardProps {
  user: any
  token: string
  onLogout: () => void
  onProfileClick?: () => void
  onEventsClick?: () => void
  onUsersClick?: () => void
}

export default function AdminDashboard({ user, token, onLogout, onProfileClick, onEventsClick, onUsersClick }: AdminDashboardProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    description: "",
    date: "",
    location: "",
    price: 0,
    total_seats: 0,
    available_seats: 0,
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    setError("")
    try {
      // Admins should see and manage all listings
      const data = await eventsAPI.getAll()
      setEvents(data)
    } catch (err: any) {
      setError(err.message || "Failed to load events")
    } finally {
      setLoading(false)
    }
  }


  const handleCreateClick = () => {
    setEditingEvent(null)
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      price: 0,
      total_seats: 0,
      available_seats: 0,
    })
    setShowCreateModal(true)
  }

  const handleEditClick = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      location: event.location,
      price: event.price,
      total_seats: event.total_seats,
      available_seats: event.available_seats,
    })
    setShowCreateModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (editingEvent) {
        await eventsAPI.update(token, editingEvent.id, formData)
        setSuccessMessage("Event updated successfully!")
      } else {
        await eventsAPI.create(token, formData)
        setSuccessMessage("Event created successfully!")
      }

      setShowCreateModal(false)
      fetchEvents()
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to save event")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (eventId: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return

    setError("")
    try {
      await eventsAPI.delete(token, eventId)
      setSuccessMessage("Event deleted successfully!")
      fetchEvents()
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to delete event")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/80">
      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-8 py-6 bg-black/20">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/80 text-sm mt-1">Manage events and bookings</p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3 justify-start md:justify-end">
          {onUsersClick && (
            <Button
              onClick={onUsersClick}
              variant="outline"
              className="border border-white/70 text-white bg-white/10 hover:bg-white/20 rounded-full px-6"
            >
              Manage Users
            </Button>
          )}
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
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex-1 flex items-center justify-center gap-2"
            >
              <User className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex-1 flex items-center justify-center gap-2" />
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

      {/* Main Content */}
      <section className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-8 flex items-start gap-3"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 text-green-600 px-6 py-4 rounded-lg mb-8 flex items-start gap-3"
            >
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>{successMessage}</div>
            </motion.div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Events</h2>
            <Button
              onClick={handleCreateClick}
              className="bg-secondary text-primary hover:bg-secondary/90 rounded-full px-8 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Event
            </Button>
          </div>

          {/* Events Table */}
          {loading && !showCreateModal ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <p className="text-gray-600 text-lg mb-6">No events yet. Create your first event!</p>
              <Button
                onClick={handleCreateClick}
                className="bg-secondary text-primary hover:bg-secondary/90 rounded-full px-8"
              >
                Create Event
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                    {/* Event Info */}
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-bold text-primary mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <Calendar className="h-4 w-4 text-secondary" />
                          <span>
                            {new Date(event.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                          <MapPin className="h-4 w-4 text-secondary" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Price</p>
                        <p className="text-xl font-bold text-secondary">${event.price}</p>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Available Seats</p>
                        <p className="text-xl font-bold text-primary">
                          {event.available_seats}/{event.total_seats}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEditClick(event)}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex-1 flex items-center justify-center gap-2"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>

                      <Button
                        onClick={() => handleDelete(event.id)}
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg flex-1 flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                    <Input
                      type="text"
                      value={formData.title || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Event title"
                      className="w-full rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                    <Input
                      type="text"
                      value={formData.location || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Event location"
                      className="w-full rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                    <Input
                      type="date"
                      value={formData.date || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                    <Input
                      type="number"
                      value={formData.price || 0}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      placeholder="Event price"
                      className="w-full rounded-lg"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Seats *</label>
                    <Input
                      type="number"
                      value={formData.total_seats || 0}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newTotalSeatsRaw = parseInt(e.target.value, 10);
                        const newTotalSeats = Number.isNaN(newTotalSeatsRaw) ? 0 : newTotalSeatsRaw;
                        const prevTotalSeats = formData.total_seats || 0;
                        const prevAvailable = formData.available_seats || 0;
                        const delta = newTotalSeats - prevTotalSeats;
                        const newAvailable = Math.max(0, Math.min(newTotalSeats, prevAvailable + delta));
                        setFormData({
                          ...formData,
                          total_seats: newTotalSeats,
                          available_seats: newAvailable,
                        });
                      }}
                      placeholder="Total seats"
                      className="w-full rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Available Seats</label>
                    <Input
                      type="number"
                      value={formData.available_seats || 0}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, available_seats: parseInt(e.target.value) })
                      }
                      placeholder="Available seats"
                      className="w-full rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Event description"
                    className="w-full rounded-lg border border-gray-300 p-3 min-h-[120px]"
                    required
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    variant="outline"
                    className="flex-1 rounded-lg"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-secondary text-primary hover:bg-secondary/90 rounded-lg flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                    {editingEvent ? "Update Event" : "Create Event"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
