import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Loader from '../common/Loader'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  course_type: string | null
  selected_course: string | null
  created_at: string
  read: boolean
}

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [modalSubmission, setModalSubmission] = useState<ContactSubmission | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ read: true })
        .eq('id', id)

      if (error) throw error
      
      // Update local state immediately for better UX
      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, read: true } : sub)
      )
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Delete error:', error)
        alert(`Failed to delete: ${error.message}. Please check your browser console for details.`)
        throw error
      }

      alert('Submission deleted successfully!')
      fetchSubmissions()
      if (modalSubmission?.id === id) {
        setModalSubmission(null)
      }
    } catch (error: any) {
      console.error('Error deleting submission:', error)
      alert(`Error: ${error.message || 'Failed to delete submission. Please check console for details.'}`)
    }
  }

  const handleViewMessage = (submission: ContactSubmission) => {
    setModalSubmission(submission)
  }

  const closeModal = () => {
    setModalSubmission(null)
  }

  if (loading) {
    return <Loader message="Loading submissions..." />
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Contact Form Submissions</h2>
        <p className="text-gray-600 mt-1">View and manage all contact form submissions</p>
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
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  What type of course
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No submissions yet
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      handleViewMessage(submission)
                      if (!submission.read) {
                        markAsRead(submission.id)
                      }
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{submission.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{submission.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {submission.selected_course || '-'}
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
      {modalSubmission && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{modalSubmission.name}</h3>
                <p className="text-gray-600 mt-1">{modalSubmission.email}</p>
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
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{modalSubmission.message || 'No message provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <p className="mt-1 text-gray-900">{modalSubmission.phone || 'Not provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">What type of course</label>
                  <p className="mt-1 text-gray-900">{modalSubmission.selected_course || 'Not selected'}</p>
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
                onClick={() => {
                  deleteSubmission(modalSubmission.id)
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

export default ContactSubmissions

