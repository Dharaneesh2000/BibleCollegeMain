import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import BrowseCourses from './pages/BrowseCourses'
import CourseDetail from './pages/CourseDetail'
import About from './pages/About'
import NewsEventsPage from './pages/NewsEventsPage'
import EventDetail from './pages/EventDetail'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col">
      {isAdminRoute ? (
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      ) : (
        <>
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/academics" element={<BrowseCourses />} />
              <Route path="/academics/:slug" element={<CourseDetail />} />
              <Route path="/news" element={<NewsEventsPage />} />
              <Route path="/news/:id" element={<EventDetail />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}

export default App