import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { bookingsAPI, eventsAPI, type Event } from "@/lib/api"
import { motion } from "framer-motion"

interface BookingCheckoutPageProps {
  eventId: number
  quantity: number
  token: string
  onBackClick: () => void
  onSuccess: (bookingId: number) => void
}

export default function BookingCheckoutPage({
  eventId,
  quantity,
  token,
  onBackClick,
  onSuccess,
}: BookingCheckoutPageProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [eventLoading, setEventLoading] = useState(true)

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const data = await eventsAPI.getById(eventId)
      setEvent(data)
    } catch (err: any) {
      setError(err.message || "Failed to load event")
    } finally {
      setEventLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const bookingData = {
        event_id: eventId,
        name,
        email,
        mobile,
        quantity,
      }

      const response = await bookingsAPI.create(token, bookingData)
      onSuccess(response.id)
    } catch (err: any) {
      setError(err.message || "Failed to create booking")
    } finally {
      setLoading(false)
    }
  }

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    )
  }

  const totalPrice = (event?.price || 0) * quantity

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
        <h1 className="text-3xl font-bold text-white">Checkout</h1>
      </header>

      {/* Main Content */}
      <section className="px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-8"
              >
                <h2 className="text-2xl font-bold text-primary mb-6">Attendee Information</h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number *</label>
                    <Input
                      type="tel"
                      value={mobile}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMobile(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full rounded-lg"
                      required
                    />
                  </div>

                  {/* Event Summary */}
                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-bold text-primary mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-700">{event?.title}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-700">
                          {quantity} × ${event?.price}
                        </p>
                        <p className="font-semibold text-gray-800">${(event?.price || 0) * quantity}</p>
                      </div>
                      <div className="flex items-center justify-between py-3 border-t">
                        <p className="font-bold text-gray-800">Total</p>
                        <p className="text-2xl font-bold text-secondary">${totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 rounded"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the terms and conditions
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-secondary text-primary hover:bg-secondary/90 py-6 text-lg font-bold rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                    {loading ? "Processing..." : "Complete Booking"}
                  </Button>
                </form>
              </motion.div>
            </div>

            {/* Order Summary Card */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-2xl p-6 sticky top-8"
              >
                <h3 className="text-lg font-bold text-primary mb-4">Order Summary</h3>

                <div className="space-y-4 pb-6 border-b">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Event</p>
                    <p className="font-semibold text-gray-800 line-clamp-2">{event?.title}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tickets</p>
                    <p className="font-semibold text-gray-800">{quantity} ticket(s)</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Price per Ticket</p>
                    <p className="font-semibold text-gray-800">${event?.price}</p>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-700">Subtotal</p>
                    <p className="font-semibold text-gray-800">${totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-700">Service Fee</p>
                    <p className="font-semibold text-gray-800">$0.00</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t text-lg">
                    <p className="font-bold text-primary">Total</p>
                    <p className="font-bold text-secondary">${totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                {/* Secure Badge */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-green-700 font-semibold">Secure Checkout</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
