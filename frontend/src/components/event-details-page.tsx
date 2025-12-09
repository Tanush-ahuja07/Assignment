import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Calendar, MapPin, Users, Loader2, AlertCircle } from "lucide-react"
import { eventsAPI, type Event } from "@/lib/api"
import { motion } from "framer-motion"

interface EventDetailsPageProps {
  eventId: number
  onBookingClick: (eventId: number, quantity: number) => void
  onBackClick: () => void
  token: string
}

export default function EventDetailsPage({ eventId, onBookingClick, onBackClick, token }: EventDetailsPageProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await eventsAPI.getById(eventId)
      setEvent(data)
    } catch (err: any) {
      setError(err.message || "Failed to load event")
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(value, event?.available_seats || 1))
    setQuantity(newQuantity)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The event you are looking for does not exist."}</p>
          <Button onClick={onBackClick} className="bg-primary text-white rounded-full px-8">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const totalPrice = event.price * quantity
  const seatsPercentage = (event.available_seats / event.total_seats) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/80">
      {/* Header */}
      <header className="flex items-center gap-4 px-8 py-6 bg-black/20">
        <button
          onClick={onBackClick}
          className="flex items-center gap-2 text-white/80 hover:text-white transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-white">Event Details</h1>
      </header>

      {/* Main Content */}
      <section className="px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Information */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl overflow-hidden shadow-2xl"
              >
                {/* Event Image */}
                <div className="h-80 bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center">
                  <div className="text-9xl">🎪</div>
                </div>

                {/* Event Details */}
                <div className="p-8">
                  <h2 className="text-4xl font-bold text-primary mb-4">{event.title}</h2>

                  <p className="text-gray-700 text-lg mb-8 leading-relaxed">{event.description}</p>

                  {/* Event Meta Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b">
                    <div className="flex items-start gap-4">
                      <div className="bg-secondary/20 p-3 rounded-lg">
                        <Calendar className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium mb-1">Date & Time</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-secondary/20 p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium mb-1">Location</p>
                        <p className="text-lg font-semibold text-gray-800">{event.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-secondary/20 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium mb-1">Availability</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {event.available_seats} seats left
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seat Availability */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700">Seats Available</p>
                      <p className="text-sm font-semibold text-secondary">
                        {event.available_seats} / {event.total_seats}
                      </p>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${seatsPercentage}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-secondary to-secondary/70"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Booking Card */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-8 sticky top-8"
              >
                <h3 className="text-2xl font-bold text-primary mb-6">Ticket Selection</h3>

                {/* Ticket Categories */}
                <div className="mb-6 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800">Standard Ticket</p>
                    <p className="text-2xl font-bold text-secondary">${event.price}</p>
                  </div>
                  <p className="text-sm text-gray-600">Full access to all sessions</p>
                </div>

                {/* Quantity Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Number of Tickets</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity === 1}
                      className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 transition"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="flex-1 px-4 py-2 border rounded-lg text-center font-semibold text-gray-800"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= (event.available_seats || 0)}
                      className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700 transition"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Max: {event.available_seats} seats</p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-700">Subtotal</p>
                    <p className="font-semibold text-gray-800">${totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-700">Service Fee</p>
                    <p className="font-semibold text-gray-800">$0.00</p>
                  </div>
                  <div className="flex items-center justify-between text-lg">
                    <p className="font-bold text-primary">Total</p>
                    <p className="font-bold text-secondary">${totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                {/* Book Button */}
                <Button
                  onClick={() => onBookingClick(eventId, quantity)}
                  className="w-full bg-secondary text-primary hover:bg-secondary/90 py-3 text-lg font-bold rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  Proceed to Booking
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
