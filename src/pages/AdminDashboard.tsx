import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ContactSubmissions from '../components/admin/ContactSubmissions'
import NewsEventsManagement from '../components/admin/NewsEventsManagement'
import TestimonialsManagement from '../components/admin/TestimonialsManagement'
import CoursesManagement from '../components/admin/CoursesManagement'
import Loader from '../components/common/Loader'

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('contact')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/admin/login')
      } else {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/admin/login')
      } else {
        setUser(session.user)
      }
    } catch (error) {
      console.error('Error checking user:', error)
      navigate('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#15133D]">
        <Loader size="large" />
      </div>
    )
  }

  const menuItems = [
    { id: 'contact', label: 'Contact Submissions', icon: '📧', color: 'bg-blue-500' },
    { id: 'news', label: 'News & Events', icon: '📰', color: 'bg-green-500' },
    { id: 'testimonials', label: 'Testimonials', icon: '💬', color: 'bg-purple-500' },
    { id: 'courses', label: 'Courses', icon: '📚', color: 'bg-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-[#15133D] text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col fixed h-screen z-50`}>
        {/* Logo/Header */}
        <div className="p-6 border-b border-[#1a1650]">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#1a1650] rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-white text-[#15133D] shadow-lg'
                  : 'text-gray-300 hover:bg-[#1a1650] hover:text-white'
              }`}
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <span className="font-medium text-justify">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-[#1a1650]">
          {sidebarOpen && (
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-1">Logged in as</p>
              <p className="text-sm font-medium text-white truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#15133D]">
                  {menuItems.find(item => item.id === activeSection)?.label || 'Admin Panel'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your website content and submissions
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {activeSection === 'contact' && <ContactSubmissions />}
          {activeSection === 'news' && <NewsEventsManagement />}
          {activeSection === 'testimonials' && <TestimonialsManagement />}
          {activeSection === 'courses' && <CoursesManagement />}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
