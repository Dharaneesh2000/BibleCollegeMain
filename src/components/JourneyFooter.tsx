import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TestimonialsBackground from '../../assets/images/Background.png'
import BookOutlinedIcon from '@mui/icons-material/BookOutlined'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import ContactModal from './ContactModal'

const JourneyFooter = () => {
  const navigate = useNavigate()
  const [showContactModal, setShowContactModal] = useState(false)

  const handleExplorePrograms = () => {
    navigate('/academics')
  }

  const handleContactUs = () => {
    setShowContactModal(true)
  }

  return (
    <>
      <section
        className="py-12 md:py-16 relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${TestimonialsBackground})`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Begin Your Journey with Us
            </h2>
            <p className="text-lg md:text-xl text-white mb-8 leading-relaxed">
              Whether you're exploring your calling or ready to take the next step, we're here to walk with you. Discover how God's Will Bible College can equip you for a lifetime of faithful ministry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleExplorePrograms}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#FFD700] text-[#1C398E] rounded-lg font-medium hover:bg-[#FFC700] transition-colors duration-300 shadow-lg"
              >
                <BookOutlinedIcon />
                <span>Explore Programs</span>
              </button>
              <button
                onClick={handleContactUs}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors duration-300"
              >
                <ContactMailOutlinedIcon />
                <span>Contact Us</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </>
  )
}

export default JourneyFooter


