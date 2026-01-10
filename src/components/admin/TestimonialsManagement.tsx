import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Loader from '../common/Loader'

interface Testimonial {
  id: string
  text: string
  author: string
  title: string
  avatar_url: string | null
  avatar_path: string | null
  is_active: boolean
  order_index: number
}

const TestimonialsManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    text: '',
    author: '',
    title: '',
    is_active: true,
    order_index: 0,
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setTestimonials(data || [])
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('Avatar size must be less than 2MB')
        return
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      setAvatarFile(file)
    }
  }

  const uploadAvatar = async (file: File, testimonialId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${testimonialId}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('testimonial-avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('testimonial-avatars')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading avatar:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let avatarUrl = null
      let avatarPath = null

      // Upload avatar if provided
      if (avatarFile) {
        const testimonialId = editingTestimonial?.id || crypto.randomUUID()
        avatarUrl = await uploadAvatar(avatarFile, testimonialId)
        if (!avatarUrl) {
          alert('Failed to upload avatar')
          setUploading(false)
          return
        }
        avatarPath = `avatars/${testimonialId}-${Date.now()}.${avatarFile.name.split('.').pop()}`
      }

      if (editingTestimonial) {
        // Update existing
        const { error } = await supabase
          .from('testimonials')
          .update({
            ...formData,
            avatar_url: avatarUrl || editingTestimonial.avatar_url,
            avatar_path: avatarPath || editingTestimonial.avatar_path,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingTestimonial.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('testimonials')
          .insert([{
            ...formData,
            avatar_url: avatarUrl,
            avatar_path: avatarPath,
          }])

        if (error) throw error
      }

      resetForm()
      fetchTestimonials()
    } catch (error: any) {
      console.error('Error saving testimonial:', error)
      alert(error.message || 'Failed to save')
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      text: testimonial.text,
      author: testimonial.author,
      title: testimonial.title,
      is_active: testimonial.is_active,
      order_index: testimonial.order_index,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchTestimonials()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      text: '',
      author: '',
      title: '',
      is_active: true,
      order_index: 0,
    })
    setAvatarFile(null)
    setEditingTestimonial(null)
    setShowForm(false)
  }

  if (loading) {
    return <Loader message="Loading..." />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Testimonials Management</h2>
          <p className="text-gray-600 mt-1">Manage student testimonials (Recommended avatar: 400x400px, max 2MB)</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#15133D] text-white rounded-lg hover:bg-[#1a1650] transition-colors"
        >
          + Add New
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow border p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingTestimonial ? 'Edit' : 'Add New'} Testimonial
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Testimonial Text * <span className="text-gray-500 font-normal">(Max 255 characters)</span>
              </label>
              <textarea
                value={formData.text}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 255) {
                    setFormData({ ...formData, text: value });
                  } else {
                    alert('Testimonial text cannot exceed 255 characters');
                  }
                }}
                required
                rows={5}
                maxLength={255}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                placeholder="Enter the testimonial text (max 255 characters)..."
              />
              <div className="mt-1 flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {formData.text.length} / 255 characters
                </p>
                {formData.text.length > 250 && (
                  <p className="text-xs text-red-500 font-medium">
                    ⚠️ Approaching character limit
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author Name *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title/Location *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                  placeholder="e.g., Canada, United States"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                />
              </div>

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active (visible on website)
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar (Optional, Recommended: 400x400px, max 2MB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
              />
              {editingTestimonial?.avatar_url && !avatarFile && (
                <img src={editingTestimonial.avatar_url} alt="Current" className="mt-2 h-24 w-24 object-cover rounded-full" />
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-[#15133D] text-white rounded-lg hover:bg-[#1a1650] transition-colors disabled:opacity-50"
              >
                {uploading ? 'Saving...' : editingTestimonial ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg shadow border p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {testimonial.avatar_url ? (
                  <img src={testimonial.avatar_url} alt={testimonial.author} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-bold">{testimonial.author[0]}</span>
                  </div>
                )}
                <div>
                  <h3 className="font-bold">{testimonial.author}</h3>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                </div>
              </div>
              {!testimonial.is_active && (
                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">Inactive</span>
              )}
            </div>
            <p className="text-gray-700 mb-4 line-clamp-4">{testimonial.text}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(testimonial)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(testimonial.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12 text-gray-500">No testimonials yet. Add your first one!</div>
      )}
    </div>
  )
}

export default TestimonialsManagement

