import { useState, useEffect } from "react"
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import CloseIcon from "@mui/icons-material/Close"
import { supabase } from "../lib/supabase"

interface ContactModalProps {
  onClose: () => void
}

const ContactModal = ({ onClose }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    select: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })
  const [showSnackbar, setShowSnackbar] = useState(false)

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
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
                <input
                  type="tel"
                  id="modal-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bible-blue focus:border-transparent text-black"
                  placeholder="Phone Number"
                />
              </div>

              <div>
                <select
                  id="modal-select"
                  name="select"
                  value={formData.select}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bible-blue focus:border-transparent text-black"
                >
                  <option value="">Select Course</option>
                  <option value="bachelor">Bachelor of Theology</option>
                  <option value="master">Master of Divinity</option>
                  <option value="certificate">Certificate Program</option>
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


