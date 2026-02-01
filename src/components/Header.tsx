import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from '../../assets/images/Logo.png' // ✅ imported instead of public path
import { supabase } from '../lib/supabase'

interface Course {
  id: string
  title: string
  slug: string
}

const Header = () => {
  const location = useLocation()
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Check if we're on the Bachelor of Theology page
  const isAcademicsPage = location.pathname.startsWith('/academics/')

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCoursesDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close dropdown when route changes
  useEffect(() => {
    setCoursesDropdownOpen(false)
  }, [location.pathname])

  // Fetch courses from database
  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, slug')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setCourses(data)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      // Set empty array on error to prevent crashes
      setCourses([])
    }
  }

  // Check if any course is active
  const isCoursesActive = location.pathname.startsWith('/academics/')

  return (
    <header
      className={`shadow-lg ${isAcademicsPage ? 'text-[#333333]' : 'text-white'}`}
      style={{
        backgroundColor: isAcademicsPage ? '#FFFFFF' : '#1E1C52',
        fontFamily: "'DM Sans', sans-serif"
      }}
      role="banner"
      aria-label="Main navigation"
    >
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={Logo} alt="God's Will Bible College Logo - Residential theological education in Coimbatore, Tamil Nadu" className="w-12 h-12" width="48" height="48" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2" role="navigation" aria-label="Main menu">
            {/* Home */}
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === '/'
                ? isAcademicsPage
                  ? 'bg-[#333333] text-white'
                  : 'bg-[#F4F4F436] text-white'
                : isAcademicsPage
                  ? 'hover:bg-gray-100 text-[#333333]'
                  : 'hover:text-bible-gold hover:bg-[#F4F4F436]'
                }`}
            >
              Home
            </Link>

            {/* Courses Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 ${isCoursesActive
                  ? isAcademicsPage
                    ? 'bg-[#333333] text-white'
                    : 'bg-[#F4F4F436] text-white'
                  : isAcademicsPage
                    ? 'hover:bg-gray-100 text-[#333333]'
                    : 'hover:text-bible-gold hover:bg-[#F4F4F436]'
                  } ${isAcademicsPage ? 'text-white' : ''}`}
                aria-expanded={coursesDropdownOpen}
                aria-haspopup="true"
              >
                Courses
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${coursesDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {coursesDropdownOpen && (
                <div
                  className={`absolute top-full left-0 mt-2 min-w-[220px] rounded-lg shadow-lg z-50 ${isAcademicsPage
                    ? 'bg-white border border-gray-200'
                    : 'bg-white border border-gray-200'
                    }`}
                  role="menu"
                >
                  {courses.length > 0 ? (
                    courses.map((course) => {
                      const coursePath = `/academics/${course.slug}`
                      const isCourseActive = location.pathname === coursePath
                      return (
                        <Link
                          key={course.id}
                          to={coursePath}
                          className={`block px-4 py-3 transition-all duration-200 first:rounded-t-lg last:rounded-b-lg ${isCourseActive
                              ? isAcademicsPage
                                ? 'bg-[#333333] text-white'
                                : 'bg-[#333333] text-white'
                              : isAcademicsPage
                                ? 'hover:bg-gray-100 text-[#333333]'
                                : 'hover:bg-gray-100 text-[#333333]'
                            }`}
                          role="menuitem"
                        >
                          {course.title}
                        </Link>
                      )
                    })
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No courses available
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Events */}
            <Link
              to="/news"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === '/news' || location.pathname.startsWith('/news/')
                ? isAcademicsPage
                  ? 'bg-[#333333] text-white'
                  : 'bg-[#F4F4F436] text-white'
                : isAcademicsPage
                  ? 'hover:bg-gray-100 text-[#333333]'
                  : 'hover:text-bible-gold hover:bg-[#F4F4F436]'
                }`}
            >
              Events
            </Link>

            {/* About Us */}
            <Link
              to="/about"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === '/about' || location.pathname.startsWith('/about/')
                ? isAcademicsPage
                  ? 'bg-[#333333] text-white'
                  : 'bg-[#F4F4F436] text-white'
                : isAcademicsPage
                  ? 'hover:bg-gray-100 text-[#333333]'
                  : 'hover:text-bible-gold hover:bg-[#F4F4F436]'
                }`}
            >
              About Us
            </Link>

            {/* Commented out Alumni - keeping for reference */}
            {/* 
            <Link
              to="/faculty"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === '/faculty'
                  ? isAcademicsPage
                    ? 'bg-[#333333] text-white'
                    : 'bg-[#F4F4F436] text-white'
                  : isAcademicsPage
                    ? 'hover:bg-gray-100 text-[#333333]'
                    : 'hover:text-bible-gold hover:bg-[#F4F4F436]'
              }`}
            >
              Alumni
            </Link>
            */}
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/contact"
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${isAcademicsPage
                ? 'bg-[#333333] text-white hover:bg-[#555555]'
                : 'bg-white text-bible-blue hover:bg-yellow-500'
                }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2" 
            aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"} 
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 mt-4 pt-4 pb-4">
            <nav className="flex flex-col space-y-2" role="navigation" aria-label="Mobile menu">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === '/'
                  ? isAcademicsPage
                    ? 'bg-[#333333] text-white'
                    : 'bg-[#F4F4F436] text-white'
                  : isAcademicsPage
                    ? 'hover:bg-gray-100 text-[#333333]'
                    : 'hover:text-bible-gold hover:bg-[#F4F4F436]'
                  }`}
              >
                Home
              </Link>

              {/* Mobile Courses Dropdown */}
              <div>
                <button
                  onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
                  className={`w-full px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-between ${isCoursesActive
                    ? isAcademicsPage
                      ? 'bg-[#333333] text-white'
                      : 'bg-[#F4F4F436] text-white'
                    : isAcademicsPage
                      ? 'hover:bg-gray-100 text-white'
                      : 'hover:text-bible-gold hover:bg-[#F4F4F436]'
                    } ${isAcademicsPage && isCoursesActive ? 'text-white' : isAcademicsPage ? 'text-white' : ''}`}
                  aria-expanded={mobileCoursesOpen}
                >
                  <span className={isAcademicsPage ? 'text-white' : 'text-white'}>Courses</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${mobileCoursesOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {mobileCoursesOpen && (
  <div className={`mt-2 ml-4 space-y-1 rounded-lg py-2 ${
    isAcademicsPage ? 'bg-[#333333]' : 'bg-[#F4F4F436]'
  }`}>
    {courses.length > 0 ? (
                      courses.map((course) => {
                        const coursePath = `/academics/${course.slug}`
                        const isCourseActive = location.pathname === coursePath
                        return (
                          <Link
                            key={course.id}
                            to={coursePath}
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setMobileCoursesOpen(false)
                            }}
                            className={`block px-4 py-2 rounded-lg transition-all duration-200 ${isCourseActive
                                ? isAcademicsPage
                                  ? 'bg-[#F4F4F436] text-white'
                                  : 'bg-[#333333] text-white'
                                : isAcademicsPage
                                  ? 'hover:bg-[#F4F4F436] text-white'
                                  : 'hover:bg-gray-100 text-[#333333]'
                              } ${isAcademicsPage ? 'text-white' : 'text-white'}`}
                          >
                            {course.title}
                          </Link>
                        )
                      })
                    ) : (
                      <div className={`px-4 py-2 text-sm ${isAcademicsPage ? 'text-white' : 'text-gray-300'}`}>
                        No courses available
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link
                to="/news"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === '/news' || location.pathname.startsWith('/news/')
                  ? isAcademicsPage
                    ? 'bg-[#333333] text-white'
                    : 'bg-[#F4F4F436] text-white'
                  : isAcademicsPage
                    ? 'hover:bg-gray-100 text-[#333333]'
                    : 'hover:text-bible-gold hover:bg-[#F4F4F436]'
                  }`}
              >
                Events
              </Link>

              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === '/about' || location.pathname.startsWith('/about/')
                  ? isAcademicsPage
                    ? 'bg-[#333333] text-white'
                    : 'bg-[#F4F4F436] text-white'
                  : isAcademicsPage
                    ? 'hover:bg-gray-100 text-[#333333]'
                    : 'hover:text-bible-gold hover:bg-[#F4F4F436]'
                  }`}
              >
                About Us
              </Link>

              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-center ${isAcademicsPage
                  ? 'bg-[#333333] text-white hover:bg-[#555555]'
                  : 'bg-white text-bible-blue hover:bg-yellow-500'
                  }`}
              >
                Contact Us
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
