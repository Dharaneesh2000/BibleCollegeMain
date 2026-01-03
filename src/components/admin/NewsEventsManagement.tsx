import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import JourneyFooter from '../JourneyFooter'

interface Speaker {
  name: string
  image_url: string | null
  description: string
  bio?: string
}

interface NewsEvent {
  id: string
  title: string
  description: string
  date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  image_url: string | null
  hero_image_url: string | null
  image_path: string | null
  read_more_link: string | null
  about_content: string | null
  what_to_expect: string[] | null
  download_resources_url: string | null
  download_resources_file_name: string | null
  speakers: Speaker[] | null
  is_active: boolean
}

const NewsEventsManagement = () => {
  const [items, setItems] = useState<NewsEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<NewsEvent | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    start_time: '',
    end_time: '',
    location: '',
    read_more_link: '',
    about_content: '',
    what_to_expect: [] as string[],
    download_resources_url: '',
    is_active: true,
  })
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [newSpeaker, setNewSpeaker] = useState({ name: '', description: '', bio: '' })
  const [newSpeakerImageFile, setNewSpeakerImageFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null)
  const [speakerImageFiles, setSpeakerImageFiles] = useState<{ [key: number]: File }>({})
  const [resourcesFile, setResourcesFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('news_events')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Parse JSON fields
      const parsedData = (data || []).map(item => ({
        ...item,
        what_to_expect: typeof item.what_to_expect === 'string' 
          ? JSON.parse(item.what_to_expect || '[]') 
          : item.what_to_expect || [],
        speakers: typeof item.speakers === 'string'
          ? JSON.parse(item.speakers || '[]')
          : item.speakers || []
      }))
      
      setItems(parsedData)
    } catch (error) {
      console.error('Error fetching news/events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'hero' | 'speaker' | 'resources' | 'new-speaker') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      if (type === 'resources') {
        if (file.size > 10 * 1024 * 1024) {
          alert('File size must be less than 10MB')
          return
        }
        setResourcesFile(file)
        return
      }
      
      // Validate file size (5MB max for images)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        return
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      if (type === 'image') {
        setImageFile(file)
      } else if (type === 'hero') {
        setHeroImageFile(file)
      } else if (type === 'new-speaker') {
        setNewSpeakerImageFile(file)
      } else if (type === 'speaker') {
        const index = parseInt(e.target.dataset.index || '0')
        setSpeakerImageFiles({ ...speakerImageFiles, [index]: file })
      }
    }
  }

  const uploadImage = async (file: File, itemId: string, folder: string = 'news-events'): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${itemId}-${Date.now()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('news-events-images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('news-events-images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  const uploadFile = async (file: File, itemId: string): Promise<{ url: string; fileName: string } | null> => {
    try {
      const fileName = `${itemId}-${Date.now()}-${file.name}`
      const filePath = `resources/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('news-events-images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('news-events-images')
        .getPublicUrl(filePath)

      return { url: data.publicUrl, fileName: file.name }
    } catch (error) {
      console.error('Error uploading file:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const itemId = editingItem?.id || crypto.randomUUID()
      let imageUrl = editingItem?.image_url || null
      let heroImageUrl = editingItem?.hero_image_url || null
      let imagePath = editingItem?.image_path || null
      let resourcesUrl = formData.download_resources_url || null
      let resourcesFileName = null

      // Upload regular image if provided
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, itemId)
        if (!imageUrl) {
          alert('Failed to upload image')
          setUploading(false)
          return
        }
        imagePath = `news-events/${itemId}-${Date.now()}.${imageFile.name.split('.').pop()}`
      }

      // Upload hero image if provided
      if (heroImageFile) {
        heroImageUrl = await uploadImage(heroImageFile, itemId, 'hero-images')
        if (!heroImageUrl) {
          alert('Failed to upload hero image')
          setUploading(false)
          return
        }
      }

      // Upload speaker images
      const updatedSpeakers = await Promise.all(
        speakers.map(async (speaker, index) => {
          if (speakerImageFiles[index]) {
            const speakerImageUrl = await uploadImage(speakerImageFiles[index], `${itemId}-speaker-${index}`, 'speaker-images')
            return { ...speaker, image_url: speakerImageUrl || speaker.image_url }
          }
          return speaker
        })
      )

      // Upload resources file if provided
      if (resourcesFile) {
        const fileData = await uploadFile(resourcesFile, itemId)
        if (fileData) {
          resourcesUrl = fileData.url
          resourcesFileName = fileData.fileName
        }
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        location: formData.location || null,
        image_url: imageUrl,
        hero_image_url: heroImageUrl,
        image_path: imagePath,
        read_more_link: formData.read_more_link || null,
        about_content: formData.about_content || null,
        what_to_expect: formData.what_to_expect.length > 0 ? JSON.stringify(formData.what_to_expect) : null,
        download_resources_url: resourcesUrl,
        download_resources_file_name: resourcesFileName,
        speakers: updatedSpeakers.length > 0 ? JSON.stringify(updatedSpeakers) : null,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      }

      if (editingItem) {
        // Update existing
        const { error } = await supabase
          .from('news_events')
          .update(eventData)
          .eq('id', editingItem.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('news_events')
          .insert([eventData])

        if (error) throw error
      }

      resetForm()
      fetchItems()
    } catch (error: any) {
      console.error('Error saving news/event:', error)
      alert(error.message || 'Failed to save')
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (item: NewsEvent) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      date: item.date,
      start_time: item.start_time || '',
      end_time: item.end_time || '',
      location: item.location || '',
      read_more_link: item.read_more_link || '',
      about_content: item.about_content || '',
      what_to_expect: item.what_to_expect || [],
      download_resources_url: item.download_resources_url || '',
      is_active: item.is_active,
    })
    setSpeakers(item.speakers || [])
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const { error } = await supabase
        .from('news_events')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchItems()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const addWhatToExpect = () => {
    setFormData({ ...formData, what_to_expect: [...formData.what_to_expect, ''] })
  }

  const updateWhatToExpect = (index: number, value: string) => {
    const updated = [...formData.what_to_expect]
    updated[index] = value
    setFormData({ ...formData, what_to_expect: updated })
  }

  const removeWhatToExpect = (index: number) => {
    const updated = formData.what_to_expect.filter((_, i) => i !== index)
    setFormData({ ...formData, what_to_expect: updated })
  }

  const addSpeaker = () => {
    if (newSpeaker.name) {
      const nextIndex = speakers.length
      setSpeakers([...speakers, { ...newSpeaker, image_url: null }])
      // If there's an image file for the new speaker, store it with the new index
      if (newSpeakerImageFile) {
        setSpeakerImageFiles({ ...speakerImageFiles, [nextIndex]: newSpeakerImageFile })
      }
      setNewSpeaker({ name: '', description: '', bio: '' })
      setNewSpeakerImageFile(null)
      // Reset the file input
      const fileInput = document.querySelector('input[data-type="new-speaker"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    }
  }

  const removeSpeaker = (index: number) => {
    setSpeakers(speakers.filter((_, i) => i !== index))
    const newFiles = { ...speakerImageFiles }
    delete newFiles[index]
    setSpeakerImageFiles(newFiles)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      start_time: '',
      end_time: '',
      location: '',
      read_more_link: '',
      about_content: '',
      what_to_expect: [],
      download_resources_url: '',
      is_active: true,
    })
    setSpeakers([])
    setNewSpeaker({ name: '', description: '', bio: '' })
    setNewSpeakerImageFile(null)
    setImageFile(null)
    setHeroImageFile(null)
    setSpeakerImageFiles({})
    setResourcesFile(null)
    setEditingItem(null)
    setShowForm(false)
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">News & Events Management</h2>
          <p className="text-gray-600 mt-1">Manage news articles and events with detailed information</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#15133D] text-white rounded-lg hover:bg-[#1a1650] transition-colors"
        >
          + Add New
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow border p-6 mb-6 max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">
            {editingItem ? 'Edit' : 'Add New'} News/Event
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="border-b pb-4">
              <h4 className="text-lg font-semibold mb-3">Basic Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                    placeholder="Brief description for event cards"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                    placeholder="e.g., Hotel Europa Amsterdam, Room 4"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="border-b pb-4">
              <h4 className="text-lg font-semibold mb-3">Images</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Image (Recommended: 1200x675px, max 5MB)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'image')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                  />
                  {editingItem?.image_url && !imageFile && (
                    <img src={editingItem.image_url} alt="Current" className="mt-2 h-32 object-cover rounded" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hero Image (Large banner for detail page, Recommended: 1920x600px, max 5MB)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'hero')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                  />
                  {editingItem?.hero_image_url && !heroImageFile && (
                    <img src={editingItem.hero_image_url} alt="Current Hero" className="mt-2 h-32 object-cover rounded" />
                  )}
                </div>
              </div>
            </div>

            {/* About Content */}
            <div className="border-b pb-4">
              <h4 className="text-lg font-semibold mb-3">About this Event</h4>
              <textarea
                value={formData.about_content}
                onChange={(e) => setFormData({ ...formData, about_content: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                placeholder="Detailed description of the event..."
              />
            </div>

            {/* What to Expect */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-semibold">What to Expect</h4>
                <button
                  type="button"
                  onClick={addWhatToExpect}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-2">
                {formData.what_to_expect.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateWhatToExpect(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                      placeholder="e.g., Worship & Prayer"
                    />
                    <button
                      type="button"
                      onClick={() => removeWhatToExpect(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {formData.what_to_expect.length === 0 && (
                  <p className="text-sm text-gray-500">No items added. Click "Add Item" to add expectations.</p>
                )}
              </div>
            </div>

            {/* Speakers */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-semibold">Speaker Details</h4>
              </div>
              <div className="space-y-4 mb-4">
                {speakers.map((speaker, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium">Speaker {index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => removeSpeaker(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={speaker.name}
                        onChange={(e) => {
                          const updated = [...speakers]
                          updated[index].name = e.target.value
                          setSpeakers(updated)
                        }}
                        placeholder="Speaker Name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                      />
                      <textarea
                        value={speaker.description || speaker.bio || ''}
                        onChange={(e) => {
                          const updated = [...speakers]
                          updated[index].description = e.target.value
                          updated[index].bio = e.target.value
                          setSpeakers(updated)
                        }}
                        placeholder="Speaker Bio/Description"
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Speaker Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          data-index={index}
                          onChange={(e) => handleImageChange(e, 'speaker')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                        />
                        {speaker.image_url && !speakerImageFiles[index] && (
                          <img src={speaker.image_url} alt={speaker.name} className="mt-2 h-20 w-20 object-cover rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border p-3 rounded-lg bg-gray-50">
                <h5 className="font-medium mb-2">Add New Speaker</h5>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newSpeaker.name}
                    onChange={(e) => setNewSpeaker({ ...newSpeaker, name: e.target.value })}
                    placeholder="Speaker Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                  />
                  <textarea
                    value={newSpeaker.description}
                    onChange={(e) => setNewSpeaker({ ...newSpeaker, description: e.target.value, bio: e.target.value })}
                    placeholder="Speaker Bio/Description"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Speaker Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      data-type="new-speaker"
                      onChange={(e) => handleImageChange(e, 'new-speaker')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                    />
                    {newSpeakerImageFile && (
                      <p className="mt-1 text-xs text-gray-600">Selected: {newSpeakerImageFile.name}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={addSpeaker}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Add Speaker
                  </button>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="border-b pb-4">
              <h4 className="text-lg font-semibold mb-3">Download Resources</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource File (PDF, DOC, etc. max 10MB)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleImageChange(e, 'resources')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                />
                {formData.download_resources_url && !resourcesFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Current: {editingItem?.download_resources_file_name || 'Resource file'}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Or Resource URL</label>
                <input
                  type="url"
                  value={formData.download_resources_url}
                  onChange={(e) => setFormData({ ...formData, download_resources_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Other */}
            <div className="border-b pb-4">
              <h4 className="text-lg font-semibold mb-3">Other</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Read More Link</label>
                <input
                  type="url"
                  value={formData.read_more_link}
                  onChange={(e) => setFormData({ ...formData, read_more_link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D]"
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center mt-4">
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

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2 bg-[#15133D] text-white rounded-lg hover:bg-[#1a1650] transition-colors disabled:opacity-50"
              >
                {uploading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow border overflow-hidden">
            {item.image_url && (
              <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{item.title}</h3>
                {!item.is_active && (
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">Inactive</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{item.date}</p>
              <p className="text-sm text-gray-700 line-clamp-2 mb-4">{item.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500">No news/events yet. Add your first one!</div>
      )}

      {/* Journey Footer */}
      <JourneyFooter />
    </div>
  )
}

export default NewsEventsManagement
