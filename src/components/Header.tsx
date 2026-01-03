import { Link, useLocation } from 'react-router-dom'
import Logo from '../../assets/images/Logo.png' // ✅ imported instead of public path

const Header = () => {
  const location = useLocation()
  
  // Check if we're on the Bachelor of Theology page
  const isAcademicsPage = location.pathname.startsWith('/academics/bachelor-of-theology')

  const navItems = [
    { label: 'Admission', path: '/' },
    { label: 'Academics', path: '/academics' },
    { label: 'Events', path: '/news' },
    { label: 'Alumni', path: '/faculty' },
    { label: 'About Us', path: '/about' }
  ]

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
            <img src={Logo} alt="God's Will Bible College Logo - Residential theological education in Rourkela, Odisha" className="w-12 h-12" width="48" height="48" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2" role="navigation" aria-label="Main menu">
            {navItems.map(item => {
              // Check if current path matches or starts with item path (for nested routes)
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path))
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? isAcademicsPage
                        ? 'bg-[#333333] text-white'
                        : 'bg-[#F4F4F436] text-white'
                      : isAcademicsPage
                        ? 'hover:bg-gray-100 text-[#333333]'
                        : 'hover:text-bible-gold hover:bg-[#F4F4F436]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/contact"
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                isAcademicsPage
                  ? 'bg-[#333333] text-white hover:bg-[#555555]'
                  : 'bg-white text-bible-blue hover:bg-yellow-500'
              }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" aria-label="Open mobile menu" aria-expanded="false">
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
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
