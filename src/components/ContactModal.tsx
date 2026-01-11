import { useState, useEffect } from "react"
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import CloseIcon from "@mui/icons-material/Close"
import { supabase } from "../lib/supabase"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input'
import type { Country } from 'react-phone-number-input'

interface ContactModalProps {
  onClose: () => void
}

interface Course {
  id: string
  title: string
  slug: string
}

const ContactModal = ({ onClose }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    select: "",
  })
  const [courses, setCourses] = useState<Course[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [phoneError, setPhoneError] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState<Country>('IN')

  // Auto-hide snackbar after 5 seconds
  useEffect(() => {
    if (showSnackbar) {
      const timer = setTimeout(() => {
        setShowSnackbar(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showSnackbar])

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Fetch courses from database
  useEffect(() => {
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
      }
    }

    fetchCourses()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhoneChange = (value: string | undefined) => {
    setPhoneError('') // Clear error on change
    
    if (!value) {
      setFormData((prev) => ({ ...prev, phone: '' }))
      return
    }

    // Try to parse phone number to get country
    let country: Country | undefined
    try {
      const phoneNumber = parsePhoneNumber(value)
      country = phoneNumber?.country as Country
      if (country) {
        setSelectedCountry(country)
      }
    } catch (e) {
      // If parsing fails, try to detect from country code
      if (value.startsWith('+91')) {
        country = 'IN'
        setSelectedCountry('IN')
      } else if (value.startsWith('+1')) {
        country = 'US'
        setSelectedCountry('US')
      } else if (value.startsWith('+44')) {
        country = 'GB'
        setSelectedCountry('GB')
      }
    }

    // Extract phone number without country code
    const phoneDigits = value.replace(/\D/g, '') // Get all digits
    let phoneNumber = phoneDigits
    
    // Remove country code based on detected country
    if (country === 'IN') {
      phoneNumber = phoneDigits.startsWith('91') ? phoneDigits.substring(2) : phoneDigits
    } else if (country === 'US' || country === 'CA') {
      phoneNumber = phoneDigits.startsWith('1') ? phoneDigits.substring(1) : phoneDigits
    } else if (country === 'GB') {
      phoneNumber = phoneDigits.startsWith('44') ? phoneDigits.substring(2) : phoneDigits
    } else {
      // For other countries, try to detect country code length
      if (phoneDigits.startsWith('91')) {
        phoneNumber = phoneDigits.substring(2)
        country = 'IN'
        setSelectedCountry('IN')
      } else if (phoneDigits.startsWith('1') && phoneDigits.length > 10) {
        phoneNumber = phoneDigits.substring(1)
      } else if (phoneDigits.startsWith('44')) {
        phoneNumber = phoneDigits.substring(2)
        country = 'GB'
        setSelectedCountry('GB')
      }
    }
    
    // Country-specific limits
    let maxLength = 15 // Default international max
    let errorMessage = ''
    
    if (country === 'IN') {
      maxLength = 10
      if (phoneNumber.length > 10) {
        errorMessage = 'Should not exceed 10 numbers'
        setPhoneError(errorMessage)
        return // Don't update the value
      }
    } else if (country === 'US' || country === 'CA') {
      maxLength = 10
      if (phoneNumber.length > 10) {
        errorMessage = 'Should not exceed 10 numbers'
        setPhoneError(errorMessage)
        return
      }
    } else if (country === 'GB') {
      maxLength = 10
      if (phoneNumber.length > 10) {
        errorMessage = 'Should not exceed 10 numbers'
        setPhoneError(errorMessage)
        return
      }
    } else {
      // For other countries, use international standard
      maxLength = 15
      if (phoneNumber.length > 15) {
        errorMessage = 'Should not exceed 15 numbers'
        setPhoneError(errorMessage)
        return
      }
    }
    
    // If within limit, update the value
    if (phoneNumber.length <= maxLength) {
      setFormData((prev) => ({ ...prev, phone: value }))
    }
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      // Validation
      if (!formData.name.trim()) {
        setSubmitStatus({ type: 'error', message: 'Name is required' })
        setShowSnackbar(true)
        setSubmitting(false)
        return
      }

      if (!formData.email.trim()) {
        setSubmitStatus({ type: 'error', message: 'Email is required' })
        setShowSnackbar(true)
        setSubmitting(false)
        return
      }

      if (!validateEmail(formData.email.trim())) {
        setSubmitStatus({ type: 'error', message: 'Please enter a valid email address' })
        setShowSnackbar(true)
        setSubmitting(false)
        return
      }

      if (formData.phone && !isValidPhoneNumber(formData.phone)) {
        setSubmitStatus({ type: 'error', message: 'Please enter a valid phone number' })
        setShowSnackbar(true)
        setSubmitting(false)
        return
      }

      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
        console.warn('Supabase not configured - form submission skipped')
        setSubmitStatus({ type: 'error', message: 'Form submission is not configured yet. Please contact us directly.' })
        setShowSnackbar(true)
        setSubmitting(false)
        return
      }

      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          selected_course: formData.select || null,
          message: '',
        }])

      if (error) throw error

      setSubmitStatus({ type: 'success', message: 'Thank you! Your message has been submitted successfully.' })
      setShowSnackbar(true)
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        select: "",
      })
      // Close modal after success
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error: any) {
      console.error('Error submitting form:', error)
      setSubmitStatus({ type: 'error', message: 'Failed to submit. Please try again later.' })
      setShowSnackbar(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form">
              <div>
                <input
                  type="text"
                  id="modal-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bible-blue focus:border-transparent text-black"
                  placeholder="Name"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  id="modal-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bible-blue focus:border-transparent text-black"
                  placeholder="Email"
                  required
                />
              </div>

              <div>
                <div className={`phone-input ${phoneError ? 'error' : ''}`}>
                  <PhoneInput
                    international
                    defaultCountry="IN"
                    country={selectedCountry}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full"
                    placeholder="Phone Number"
                  />
                </div>
                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
              </div>

              <div>
                <select
                  id="modal-select"
                  name="select"
                  value={formData.select}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bible-blue focus:border-transparent bg-white appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                    color: '#9CA3AF'
                  }}
                >
                  <option value="" disabled style={{ color: '#9CA3AF' }}>What type of course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id} style={{ color: '#9CA3AF' }}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group w-full bg-bible-blue text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#15133D" }}
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-2">
                  {submitting ? 'Submitting...' : 'Schedule a call'}
                </span>
                {!submitting && (
                  <ArrowRightAltIcon className="opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Snackbar Notification */}
      {showSnackbar && submitStatus.type && (
        <div
          className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-300 ${
            submitStatus.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {submitStatus.type === 'success' ? (
            <CheckCircleIcon className="text-white" />
          ) : (
            <ErrorIcon className="text-white" />
          )}
          <span className="font-medium">{submitStatus.message}</span>
          <button
            onClick={() => setShowSnackbar(false)}
            className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <CloseIcon className="text-white text-sm" />
          </button>
        </div>
      )}
    </>
  )
}

export default ContactModal


