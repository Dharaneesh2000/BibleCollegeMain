import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Loader from '../common/Loader'
import jsPDF from 'jspdf'

interface Enrollment {
  id: string
  course_id: string | null
  course_title: string
  name: string
  address: string
  phone: string
  email: string
  date_of_birth: string
  nationality: string
  languages: string
  marital_status: string
  church_name: string
  church_position: string | null
  pastor_overseer_awareness: boolean
  previous_bible_school: boolean
  e_signature_url: string
  photo_copy_url: string
  created_at: string
  updated_at: string
  read: boolean
}

const EnrollmentManagement = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all')
  const [downloadingPDF, setDownloadingPDF] = useState<string | null>(null)

  useEffect(() => {
    fetchEnrollments()
  }, [filterRead])

  const fetchEnrollments = async () => {
    try {
      let query = supabase
        .from('enrollments')
        .select('*')
        .order('created_at', { ascending: false })

      if (filterRead === 'read') {
        query = query.eq('read', true)
      } else if (filterRead === 'unread') {
        query = query.eq('read', false)
      }

      const { data, error } = await query

      if (error) throw error
      setEnrollments(data || [])
    } catch (error) {
      console.error('Error fetching enrollments:', error)
      alert('Error loading enrollments. Please check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({ read: true })
        .eq('id', id)

      if (error) throw error
      fetchEnrollments()
      if (selectedEnrollment?.id === id) {
        setSelectedEnrollment({ ...selectedEnrollment, read: true })
      }
    } catch (error) {
      console.error('Error marking as read:', error)
      alert('Failed to update status')
    }
  }

  const deleteEnrollment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enrollment?')) return

    try {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', id)

      if (error) throw error
      alert('Enrollment deleted successfully!')
      fetchEnrollments()
      if (selectedEnrollment?.id === id) {
        setSelectedEnrollment(null)
      }
    } catch (error: any) {
      console.error('Error deleting enrollment:', error)
      alert(`Error: ${error.message || 'Failed to delete enrollment'}`)
    }
  }

  // Helper function to load image and convert to base64
  const loadImageAsBase64 = async (url: string): Promise<string> => {
    try {
      // First, try using fetch to get the image blob (better CORS handling)
      const response = await fetch(url, { mode: 'cors' })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const blob = await response.blob()
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = reader.result as string
          // Verify it's an image by loading it
          const img = new Image()
          img.onload = () => resolve(base64)
          img.onerror = () => reject(new Error('Invalid image data'))
          img.src = base64
        }
        reader.onerror = () => reject(new Error('Failed to read image file'))
        reader.readAsDataURL(blob)
      })
    } catch (fetchError) {
      // Fallback to direct image loading if fetch fails
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (!ctx) {
              reject(new Error('Could not get canvas context'))
              return
            }
            ctx.drawImage(img, 0, 0)
            const base64 = canvas.toDataURL('image/jpeg', 0.8)
            resolve(base64)
          } catch (error) {
            reject(error)
          }
        }
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
        img.src = url
      })
    }
  }

  const downloadAsPDF = async (enrollment: Enrollment) => {
    setDownloadingPDF(enrollment.id)
    
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      let yPosition = margin

      // Helper function to add a new page if needed
      const checkPageBreak = (requiredHeight: number) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
          return true
        }
        return false
      }

      // Title
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('Course Enrollment Form', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15

      // Course Information Section
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Course Information', margin, yPosition)
      yPosition += 8

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text(`Course: ${enrollment.course_title}`, margin, yPosition)
      yPosition += 6
      doc.text(`Enrollment Date: ${new Date(enrollment.created_at).toLocaleDateString()}`, margin, yPosition)
      yPosition += 10

      checkPageBreak(30)

      // Personal Information Section
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Personal Information', margin, yPosition)
      yPosition += 8

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text(`Name: ${enrollment.name}`, margin, yPosition)
      yPosition += 6
      doc.text(`Email: ${enrollment.email}`, margin, yPosition)
      yPosition += 6
      doc.text(`Phone: ${enrollment.phone}`, margin, yPosition)
      yPosition += 6
      doc.text(`Date of Birth: ${new Date(enrollment.date_of_birth).toLocaleDateString()}`, margin, yPosition)
      yPosition += 6
      doc.text(`Nationality: ${enrollment.nationality}`, margin, yPosition)
      yPosition += 6
      doc.text(`Languages: ${enrollment.languages}`, margin, yPosition)
      yPosition += 6
      doc.text(`Marital Status: ${enrollment.marital_status}`, margin, yPosition)
      yPosition += 6

      // Address (can be long, so handle it properly)
      const addressLines = doc.splitTextToSize(`Address: ${enrollment.address}`, pageWidth - 2 * margin)
      doc.text(addressLines, margin, yPosition)
      yPosition += addressLines.length * 6 + 10

      checkPageBreak(40)

      // Church & Training Information Section
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Church & Training Information', margin, yPosition)
      yPosition += 8

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text(`Church Name: ${enrollment.church_name}`, margin, yPosition)
      yPosition += 6
      if (enrollment.church_position) {
        doc.text(`Church Position: ${enrollment.church_position}`, margin, yPosition)
        yPosition += 6
      }
      doc.text(`Pastor/Overseer Awareness: ${enrollment.pastor_overseer_awareness ? 'Yes' : 'No'}`, margin, yPosition)
      yPosition += 6
      doc.text(`Previous Bible School/College/Seminary: ${enrollment.previous_bible_school ? 'Yes' : 'No'}`, margin, yPosition)
      yPosition += 10

      checkPageBreak(80) // Reserve space for images

      // Documents Section with Images
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Documents', margin, yPosition)
      yPosition += 8

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')

      // Load and embed E-Signature image
      try {
        doc.text('E-Signature:', margin, yPosition)
        yPosition += 8
        
        checkPageBreak(50) // Check if we need new page for image
        
        const eSignatureBase64 = await loadImageAsBase64(enrollment.e_signature_url)
        
        // Get image dimensions by creating a temporary image
        const tempImg = new Image()
        tempImg.src = eSignatureBase64
        await new Promise((resolve) => {
          tempImg.onload = resolve
        })
        
        // Calculate image dimensions to fit within page margins while maintaining aspect ratio
        const maxImageWidth = pageWidth - 2 * margin
        const maxImageHeight = 50 // Max height for signature
        const aspectRatio = tempImg.width / tempImg.height
        let imageWidth = maxImageWidth
        let imageHeight = imageWidth / aspectRatio
        
        // If height exceeds max, scale down based on height
        if (imageHeight > maxImageHeight) {
          imageHeight = maxImageHeight
          imageWidth = imageHeight * aspectRatio
        }
        
        doc.addImage(eSignatureBase64, 'JPEG', margin, yPosition, imageWidth, imageHeight, undefined, 'FAST')
        yPosition += imageHeight + 10
      } catch (error) {
        console.error('Error loading e-signature:', error)
        doc.text('E-Signature: Failed to load image', margin, yPosition)
        yPosition += 8
        doc.text(`URL: ${enrollment.e_signature_url.substring(0, 80)}...`, margin, yPosition)
        yPosition += 6
      }

      checkPageBreak(90) // Reserve space for photo copy

      // Load and embed Photo Copy image
      try {
        doc.text('Photo Copy:', margin, yPosition)
        yPosition += 8
        
        checkPageBreak(70) // Check if we need new page for image
        
        const photoCopyBase64 = await loadImageAsBase64(enrollment.photo_copy_url)
        
        // Get image dimensions by creating a temporary image
        const tempImg = new Image()
        tempImg.src = photoCopyBase64
        await new Promise((resolve) => {
          tempImg.onload = resolve
        })
        
        // Calculate image dimensions to fit within page margins while maintaining aspect ratio
        const maxImageWidth = pageWidth - 2 * margin
        const maxImageHeight = 70 // Max height for photo copy
        const aspectRatio = tempImg.width / tempImg.height
        let imageWidth = maxImageWidth
        let imageHeight = imageWidth / aspectRatio
        
        // If height exceeds max, scale down based on height
        if (imageHeight > maxImageHeight) {
          imageHeight = maxImageHeight
          imageWidth = imageHeight * aspectRatio
        }
        
        doc.addImage(photoCopyBase64, 'JPEG', margin, yPosition, imageWidth, imageHeight, undefined, 'FAST')
        yPosition += imageHeight + 10
      } catch (error) {
        console.error('Error loading photo copy:', error)
        doc.text('Photo Copy: Failed to load image', margin, yPosition)
        yPosition += 8
        doc.text(`URL: ${enrollment.photo_copy_url.substring(0, 80)}...`, margin, yPosition)
        yPosition += 6
      }

      // Footer
      checkPageBreak(20)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        pageWidth / 2,
        pageHeight - 15,
        { align: 'center' }
      )

      // Save the PDF
      const fileName = `enrollment_${enrollment.name.replace(/\s+/g, '_')}_${enrollment.id.substring(0, 8)}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please check console for details.')
    } finally {
      setDownloadingPDF(null)
    }
  }

  const handleViewEnrollment = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment)
    if (!enrollment.read) {
      markAsRead(enrollment.id)
    }
  }

  const closeModal = () => {
    setSelectedEnrollment(null)
  }

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (filterRead === 'read') return enrollment.read
    if (filterRead === 'unread') return !enrollment.read
    return true
  })

  if (loading) {
    return <Loader message="Loading enrollments..." />
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Enrollments</h2>
          <p className="text-gray-600 mt-1">View and manage all course enrollment submissions</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterRead('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterRead === 'all'
                ? 'bg-[#15133D] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterRead('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterRead === 'unread'
                ? 'bg-[#15133D] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilterRead('read')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterRead === 'read'
                ? 'bg-[#15133D] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Read
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No enrollments found
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((enrollment) => (
                  <tr
                    key={enrollment.id}
                    className={`hover:bg-gray-50 ${!enrollment.read ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{enrollment.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{enrollment.course_title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{enrollment.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{enrollment.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(enrollment.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          enrollment.read
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {enrollment.read ? 'Read' : 'New'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewEnrollment(enrollment)}
                          className="text-[#15133D] hover:text-[#0f0d2a] font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => downloadAsPDF(enrollment)}
                          disabled={downloadingPDF === enrollment.id}
                          className={`text-green-600 hover:text-green-800 font-medium ${
                            downloadingPDF === enrollment.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {downloadingPDF === enrollment.id ? 'Generating...' : 'Download PDF'}
                        </button>
                        <button
                          onClick={() => deleteEnrollment(enrollment.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedEnrollment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedEnrollment.name}</h3>
                <p className="text-gray-600 mt-1">{selectedEnrollment.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Enrolled in: {selectedEnrollment.course_title}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="overflow-y-auto p-6 flex-1">
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-gray-900">{selectedEnrollment.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-gray-900">{selectedEnrollment.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-gray-900">{selectedEnrollment.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                      <p className="mt-1 text-gray-900">
                        {new Date(selectedEnrollment.date_of_birth).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nationality</label>
                      <p className="mt-1 text-gray-900">{selectedEnrollment.nationality}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Languages</label>
                      <p className="mt-1 text-gray-900">{selectedEnrollment.languages}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Marital Status</label>
                      <p className="mt-1 text-gray-900">{selectedEnrollment.marital_status}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-gray-900">{selectedEnrollment.address}</p>
                  </div>
                </div>

                {/* Church & Training Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Church & Training Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Church Name</label>
                      <p className="mt-1 text-gray-900">{selectedEnrollment.church_name}</p>
                    </div>
                    {selectedEnrollment.church_position && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Church Position</label>
                        <p className="mt-1 text-gray-900">{selectedEnrollment.church_position}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Pastor/Overseer Awareness
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedEnrollment.pastor_overseer_awareness ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Previous Bible School/College/Seminary
                      </label>
                      <p className="mt-1 text-gray-900">
                        {selectedEnrollment.previous_bible_school ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Documents</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">E-Signature</label>
                      <div className="mt-1">
                        <a
                          href={selectedEnrollment.e_signature_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#15133D] hover:underline"
                        >
                          View E-Signature
                        </a>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Photo Copy</label>
                      <div className="mt-1">
                        <a
                          href={selectedEnrollment.photo_copy_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#15133D] hover:underline"
                        >
                          View Photo Copy
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => downloadAsPDF(selectedEnrollment)}
                disabled={downloadingPDF === selectedEnrollment.id}
                className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
                  downloadingPDF === selectedEnrollment.id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {downloadingPDF === selectedEnrollment.id ? 'Generating PDF...' : 'Download PDF'}
              </button>
              <button
                onClick={() => {
                  deleteEnrollment(selectedEnrollment.id)
                  closeModal()
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnrollmentManagement

