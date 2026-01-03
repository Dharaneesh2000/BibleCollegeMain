import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

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
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)

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
      fetchSubmissions()
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

      // Success - refresh the list and clear selection
      alert('Submission deleted successfully!')
      fetchSubmissions()
      setSelectedSubmission(null)
    } catch (error: any) {
      console.error('Error deleting submission:', error)
      alert(`Error: ${error.message || 'Failed to delete submission. Please check console for details.'}`)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading submissions...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Contact Form Submissions</h2>
        <p className="text-gray-600 mt-1">View and manage all contact form submissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow border">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Submissions ({submissions.length})</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {submissions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No submissions yet</div>
            ) : (
              submissions.map((submission) => (
                <div
                  key={submission.id}
                  onClick={() => {
                    setSelectedSubmission(submission)
                    if (!submission.read) markAsRead(submission.id)
                  }}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    !submission.read ? 'bg-blue-50' : ''
                  } ${selectedSubmission?.id === submission.id ? 'bg-blue-100' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{submission.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{submission.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {!submission.read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow border">
          {selectedSubmission ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedSubmission.name}</h3>
                  <p className="text-gray-600 mt-1">{selectedSubmission.email}</p>
                </div>
                <button
                  onClick={() => deleteSubmission(selectedSubmission.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-gray-900">{selectedSubmission.phone || 'Not provided'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Course Type</label>
                  <p className="mt-1 text-gray-900">{selectedSubmission.course_type || 'Not specified'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Selected Course</label>
                  <p className="mt-1 text-gray-900">{selectedSubmission.selected_course || 'Not selected'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Submitted</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(selectedSubmission.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              Select a submission to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactSubmissions

