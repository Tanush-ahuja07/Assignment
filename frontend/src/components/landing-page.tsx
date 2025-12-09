import { Button } from "@/components/ui/button"
import { ChevronRight, MapPin } from "lucide-react"

interface LandingPageProps {
  onLoginClick: () => void
  onSignupClick: () => void
}

export default function LandingPage({ onLoginClick, onSignupClick }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/80">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <h1 className="text-3xl font-bold text-white">BookItNow</h1>
        <div className="flex items-center gap-6">
          <div className="text-right text-white/90">
            <p className="text-sm">(+91) 12345 67890</p>
            <p className="text-sm">example.com</p>
          </div>
          <Button onClick={onSignupClick} className="bg-white text-primary hover:bg-white/90 rounded-full px-8">
            Buy Ticket
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-8 py-20">
        <div className="text-center max-w-4xl">
          <h2 className="text-6xl md:text-7xl font-bold text-secondary mb-8 text-balance">
            Book. Experience. Remember.
            <br />
            Your Next Event Awaits
          </h2>

          <p className="text-xl text-white/80 mb-12 text-balance">
            Discover amazing events and <span className="text-white">secure your tickets</span>
            <br />
            in just a few clicks. Your unforgettable experience starts here.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <Button
              onClick={onSignupClick}
              className="bg-white text-primary hover:bg-white/90 rounded-full px-8 py-6 text-lg"
            >
              Buy Ticket
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3 bg-secondary text-primary px-6 py-3 rounded-full">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">Mumbai, India</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={onLoginClick}
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-full px-8 py-6 bg-transparent"
            >
              Login
            </Button>
            <Button
              onClick={onSignupClick}
              className="bg-secondary text-primary hover:bg-secondary/90 rounded-full px-8 py-6"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 text-white/70 text-center py-6 text-sm">
        <p>&copy; 2025 BookItNow. All rights reserved.</p>
      </footer>
    </div>
  )
}
