import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download } from "lucide-react"
import { motion } from "framer-motion"
import QRCode from "qrcode.react"

interface BookingSuccessPageProps {
  bookingId: number
  quantity: number
  eventTitle: string
  totalAmount: number
  onContinue: () => void
}

export default function BookingSuccessPage({
  bookingId,
  quantity,
  eventTitle,
  totalAmount,
  onContinue,
}: BookingSuccessPageProps) {
  useEffect(() => {
    // Trigger confetti animation
    if (typeof window !== "undefined") {
      const canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight
          animateConfetti(ctx, canvas)
        }
      }
    }
  }, [])

  const animateConfetti = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const particles: any[] = []

    // Create confetti particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 5 + 2,
        color: ["#FF6B6B", "#FFA500", "#FFD700", "#4ECDC4", "#45B7D1"][Math.floor(Math.random() * 5)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.y += p.vy
        p.x += p.vx
        p.vy += 0.1 // gravity
        p.rotation += p.rotationSpeed

        if (p.y > canvas.height) {
          particles.splice(i, 1)
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()
      })

      if (particles.length > 0) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  const handleDownloadTicket = () => {
    const element = document.getElementById("qr-code")
    if (element) {
      const link = document.createElement("a")
      link.href = (element.querySelector("canvas") as HTMLCanvasElement)?.toDataURL("image/png") || ""
      link.download = `ticket-${bookingId}.png`
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Confetti Canvas */}
      <canvas id="confetti-canvas" className="fixed inset-0 pointer-events-none" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-primary mb-3">Booking Confirmed!</h1>
            <p className="text-gray-600 text-lg">
              Your booking has been successfully completed. Here's your confirmation.
            </p>
          </motion.div>

          {/* Booking Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-2xl p-8 mb-8 space-y-4 text-left"
          >
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-700 font-medium">Booking ID</span>
              <span className="text-xl font-bold text-primary">#{bookingId}</span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-700 font-medium">Event</span>
              <span className="font-semibold text-gray-800">{eventTitle}</span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-700 font-medium">Number of Tickets</span>
              <span className="font-semibold text-gray-800">{quantity}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-secondary">${totalAmount.toFixed(2)}</span>
            </div>
          </motion.div>

          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 p-6 bg-gray-50 rounded-2xl"
          >
            <p className="text-sm text-gray-600 font-medium mb-4">Scan this QR code to download your ticket</p>
            <div id="qr-code" className="flex justify-center">
              <QRCode value={`booking-${bookingId}`} size={200} level="H" includeMargin={true} />
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={handleDownloadTicket}
              className="flex-1 bg-secondary text-primary hover:bg-secondary/90 py-6 text-lg font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              Download Ticket
            </Button>

            <Button
              onClick={onContinue}
              className="flex-1 bg-primary text-white hover:bg-primary/90 py-6 text-lg font-bold rounded-lg transition-all duration-300"
            >
              Continue
            </Button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <p className="text-sm text-blue-700">
              A confirmation email has been sent to your registered email address.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
