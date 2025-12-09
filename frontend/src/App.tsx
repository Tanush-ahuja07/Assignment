import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom"
import LandingPage from "@/components/landing-page"
import LoginPage from "@/components/login-page"
import SignupPage from "@/components/signup-page"
import ProfilePage from "@/components/profile-page"
import EventListingPage from "@/components/events-listing-page"
import EventDetailsPage from "@/components/event-details-page"
import BookingCheckoutPage from "@/components/booking-checkout-page"
import BookingSuccessPage from "@/components/booking-success-page"
import AdminDashboard from "@/components/admin-dashboard"
import AdminUsers from "@/components/admin-users"
import { authAPI } from "@/lib/api"

function AppContent() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [bookingData, setBookingData] = useState({ quantity: 0, totalAmount: 0, eventTitle: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load token from localStorage if available
    const savedToken = localStorage.getItem("auth_token")
    if (savedToken) {
      setToken(savedToken)
      // Fetch user data
      fetchUserData(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserData = async (authToken: string) => {
    try {
      const userData = await authAPI.getMe(authToken)
      setUser(userData)
    } catch (error) {
      console.error("Failed to fetch user data:", error)
      localStorage.removeItem("auth_token")
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (token: string, userData: any) => {
    localStorage.setItem("auth_token", token)
    setToken(token)
    setUser(userData)

    if (userData.role === "admin") {
      navigate("/admin")
    } else {
      navigate("/events")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    setToken(null)
    setUser(null)
    navigate("/")
  }

  const handleEventSelect = (eventId: number) => {
    setSelectedEventId(eventId)
    navigate(`/events/${eventId}`)
  }

  const handleBookingClick = (eventId: number, quantity: number) => {
    setSelectedEventId(eventId)
    // Fetch event details to get title and price
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    fetch(`${apiUrl}/events/${eventId}`)
      .then((res) => res.json())
      .then((event) => {
        setBookingData({
          quantity,
          totalAmount: event.price * quantity,
          eventTitle: event.title,
        })
        navigate("/booking/checkout")
      })
      .catch((err) => console.error("Failed to fetch event:", err))
  }

  const handleBookingSuccess = (bookingId: number) => {
    navigate("/booking/success")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <LandingPage
          onLoginClick={() => navigate("/login")}
          onSignupClick={() => navigate("/signup")}
        />
      } />
      
      <Route path="/login" element={
        token ? <Navigate to={user?.role === "admin" ? "/admin" : "/events"} /> :
        <LoginPage
          onSuccess={handleLogin}
          onSignupClick={() => navigate("/signup")}
          onBackClick={() => navigate("/")}
        />
      } />
      
      <Route path="/signup" element={
        token ? <Navigate to={user?.role === "admin" ? "/admin" : "/events"} /> :
        <SignupPage
          onSuccess={handleLogin}
          onLoginClick={() => navigate("/login")}
          onBackClick={() => navigate("/")}
        />
      } />

      {/* Protected Routes */}
      <Route path="/profile" element={
        !token ? <Navigate to="/login" /> :
        <ProfilePage
          user={user}
          onLogout={handleLogout}
          onBrowseEvents={() => navigate("/events")}
        />
      } />

      <Route path="/events" element={
        !token ? <Navigate to="/login" /> :
        <EventListingPage
          onEventSelect={handleEventSelect}
          onProfileClick={() => navigate("/profile")}
          onLogout={handleLogout}
          token={token}
          user={user}
          onMyListingsClick={() => navigate("/admin")}
        />
      } />

      <Route path="/events/:id" element={
        !token ? <Navigate to="/login" /> :
        <EventDetailsRoute 
          onBookingClick={handleBookingClick}
          onBackClick={() => navigate("/events")}
          token={token}
        />
      } />

      <Route path="/booking/checkout" element={
        !token || !selectedEventId ? <Navigate to="/events" /> :
        <BookingCheckoutPage
          eventId={selectedEventId}
          quantity={bookingData.quantity}
          token={token}
          onBackClick={() => navigate(`/events/${selectedEventId}`)}
          onSuccess={handleBookingSuccess}
        />
      } />

      <Route path="/booking/success" element={
        !token ? <Navigate to="/login" /> :
        <BookingSuccessPage
          bookingId={1}
          quantity={bookingData.quantity}
          eventTitle={bookingData.eventTitle}
          totalAmount={bookingData.totalAmount}
          onContinue={() => navigate("/events")}
        />
      } />

      <Route path="/admin" element={
        !token ? <Navigate to="/login" /> :
        user?.role !== "admin" ? <Navigate to="/events" /> :
        <AdminDashboard 
          user={user} 
          token={token} 
          onLogout={handleLogout}
          onProfileClick={() => navigate("/profile")}
          onEventsClick={() => navigate("/events")}
          onUsersClick={() => navigate("/admin/users")}
        />
      } />

      <Route path="/admin/users" element={
        !token ? <Navigate to="/login" /> :
        user?.role !== "admin" ? <Navigate to="/events" /> :
        <AdminUsers
          token={token}
          onBack={() => navigate("/admin")}
          onLogout={handleLogout}
          onProfileClick={() => navigate("/profile")}
          onEventsClick={() => navigate("/events")}
        />
      } />

      {/* Catch all - redirect to landing */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

// Helper component to handle event detail route params
function EventDetailsRoute({ onBookingClick, onBackClick, token }: any) {
  const { id } = useParams()
  return (
    <EventDetailsPage
      eventId={parseInt(id || "0")}
      onBookingClick={onBookingClick}
      onBackClick={onBackClick}
      token={token}
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
