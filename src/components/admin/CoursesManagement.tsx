import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface Course {
  id: string
  title: string
  slug: string
  duration: string | null
  description: string | null
  overview: string | null
  image_url: string | null
  image_path: string | null
  hover_image_url: string | null
  hover_image_path: string | null
  path: string | null
  is_active: boolean
  order_index: number
  // Course Hero Section
  hero_title: string | null
  hero_description: string | null
  hero_duration_tag: string | null
  hero_format_tag: string | null
  hero_degree_tag: string | null
  // Enroll Card Section
  certificate_image_url: string | null
  certificate_image_path: string | null
  enroll_languages: string | null
  enroll_course_type: string | null
  enroll_accredited: boolean | null
  // Course Catalog Section
  catalog_file_url: string | null
  catalog_file_path: string | null
  catalog_file_name: string | null
  catalog_file_size: string | null
}

interface CourseContent {
  id: string
  course_id: string
  content_type: string
  title: string | null
  content: string
  metadata: any
  order_index: number
}

interface CurriculumYear {
  year: string
  title: string
  topics: string[]
  color: string
}

interface Requirement {
  title: string
  icon: string
  bgColor: string
  borderColor: string
}

const CoursesManagement = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [courseContents, setCourseContents] = useState<CourseContent[]>([])
  const [activeSection, setActiveSection] = useState<'basic' | 'hero' | 'enroll' | 'catalog' | 'overview' | 'curriculum' | 'requirements'>('basic')
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    duration: '',
    description: '',
    overview: '',
    is_active: true,
    order_index: 0,
    // Hero Section
    hero_title: '',
    hero_description: '',
    hero_duration_tag: '',
    hero_format_tag: '',
    hero_degree_tag: '',
    // Enroll Card
    enroll_languages: '',
    enroll_course_type: '',
    enroll_accredited: true,
    // Catalog
    catalog_file_name: '',
    catalog_file_size: '',
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [hoverImageFile, setHoverImageFile] = useState<File | null>(null)
  const [certificateImageFile, setCertificateImageFile] = useState<File | null>(null)
  const [catalogFile, setCatalogFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  
  // Curriculum and Requirements state
  const [curriculumYears, setCurriculumYears] = useState<CurriculumYear[]>([
    { year: '1st year', title: '', topics: [], color: '#2B7FFF' },
    { year: '2nd year', title: '', topics: [], color: '#60A563' },
    { year: '3rd year', title: '', topics: [], color: '#AD46FF' },
    { year: '4th year', title: '', topics: [], color: '#F0B100' },
  ])
  const [requirements, setRequirements] = useState<Requirement[]>([
    { title: '', icon: 'school', bgColor: '#EFF6FF', borderColor: '#155DFC' },
    { title: '', icon: 'certificate', bgColor: '#F0FDF4', borderColor: '#00A63E' },
    { title: '', icon: 'document', bgColor: '#FAF5FF', borderColor: '#9810FA' },
  ])
  const [overviewContent, setOverviewContent] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourse && !showForm) {
      fetchCourseContents(selectedCourse.id)
    }
  }, [selectedCourse, showForm])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setCourses(data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCourseContents = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_content')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })

      if (error) throw error
      setCourseContents(data || [])
      
      // Load curriculum and requirements from course_content
      const curriculumContent = data?.find(c => c.content_type === 'curriculum')
      const requirementsContent = data?.find(c => c.content_type === 'requirements')
      
      if (curriculumContent?.metadata?.years && Array.isArray(curriculumContent.metadata.years)) {
        setCurriculumYears(curriculumContent.metadata.years)
      } else {
        setCurriculumYears([
          { year: '1st year', title: '', topics: [], color: '#2B7FFF' },
          { year: '2nd year', title: '', topics: [], color: '#60A563' },
          { year: '3rd year', title: '', topics: [], color: '#AD46FF' },
          { year: '4th year', title: '', topics: [], color: '#F0B100' },
        ])
      }
      if (requirementsContent?.metadata?.requirements && Array.isArray(requirementsContent.metadata.requirements)) {
        setRequirements(requirementsContent.metadata.requirements)
      } else {
        setRequirements([
          { title: '', icon: 'school', bgColor: '#EFF6FF', borderColor: '#155DFC' },
          { title: '', icon: 'certificate', bgColor: '#F0FDF4', borderColor: '#00A63E' },
          { title: '', icon: 'document', bgColor: '#FAF5FF', borderColor: '#9810FA' },
        ])
      }
    } catch (error) {
      console.error('Error fetching course contents:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const validateImageDimensions = (file: File, expectedWidth: number, expectedHeight: number, tolerance: number = 50): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      const url = URL.createObjectURL(file)
      
      img.onload = () => {
        URL.revokeObjectURL(url)
        const width = img.width
        const height = img.height
        const widthDiff = Math.abs(width - expectedWidth)
        const heightDiff = Math.abs(height - expectedHeight)
        
        if (widthDiff <= tolerance && heightDiff <= tolerance) {
          resolve(true)
        } else {
          alert(`Image dimensions should be ${expectedWidth}x${expectedHeight}px (or close). Current: ${width}x${height}px`)
          resolve(false)
        }
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(false)
      }
      
      img.src = url
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'hover' | 'certificate') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        e.target.value = ''
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        e.target.value = ''
        return
      }
      
      // Validate dimensions for certificate image
      if (type === 'certificate') {
        const isValid = await validateImageDimensions(file, 800, 600, 100)
        if (!isValid) {
          e.target.value = ''
          return
        }
      }
      
      if (type === 'image') {
        setImageFile(file)
      } else if (type === 'hover') {
        setHoverImageFile(file)
      } else if (type === 'certificate') {
        setCertificateImageFile(file)
      }
    }
  }

  const handleCatalogFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file')
        return
      }
      setCatalogFile(file)
      const fileSizeKB = (file.size / 1024).toFixed(2)
      setFormData(prev => ({
        ...prev,
        catalog_file_name: file.name,
        catalog_file_size: `${fileSizeKB} KB`
      }))
    }
  }

  const uploadImage = async (file: File, courseId: string, type: 'image' | 'hover' | 'certificate'): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${courseId}-${type}-${Date.now()}.${fileExt}`
      const filePath = `courses/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('course-images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('course-images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  const uploadCatalog = async (file: File, courseId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${courseId}-catalog-${Date.now()}.${fileExt}`
      const filePath = `catalogs/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('course-catalogs')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('course-catalogs')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading catalog:', error)
      return null
    }
  }

  const validateForm = (): boolean => {
    // Basic required fields
    if (!formData.title.trim()) {
      alert('❌ Please enter a course title')
      setActiveSection('basic')
      return false
    }
    if (!formData.slug.trim()) {
      alert('❌ Please enter a slug (URL-friendly name)')
      setActiveSection('basic')
      return false
    }
    
    // Check if at least one image is uploaded for new courses
    if (!editingCourse && !imageFile) {
      alert('❌ Please upload a course image')
      setActiveSection('basic')
      return false
    }
    
    // Validate enroll card fields
    if (!formData.enroll_languages.trim()) {
      alert('❌ Please enter languages for the enroll card')
      setActiveSection('enroll')
      return false
    }
    if (!formData.enroll_course_type.trim()) {
      alert('❌ Please enter course type for the enroll card')
      setActiveSection('enroll')
      return false
    }
    const hasCertificateImage = editingCourse?.certificate_image_url || certificateImageFile
    if (!hasCertificateImage) {
      alert('❌ Please upload a certificate image for the enroll card')
      setActiveSection('enroll')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    setUploading(true)

    try {
      const slug = formData.slug || generateSlug(formData.title)
      const courseId = editingCourse?.id || crypto.randomUUID()

      let imageUrl = editingCourse?.image_url || null
      let hoverImageUrl = editingCourse?.hover_image_url || null
      let certificateImageUrl = editingCourse?.certificate_image_url || null
      let catalogFileUrl = editingCourse?.catalog_file_url || null
      let imagePath = editingCourse?.image_path || null
      let hoverImagePath = editingCourse?.hover_image_path || null
      let certificateImagePath = editingCourse?.certificate_image_path || null
      let catalogFilePath = editingCourse?.catalog_file_path || null

      // Upload images if provided
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, courseId, 'image')
        if (!imageUrl) {
          alert('Failed to upload image')
          setUploading(false)
          return
        }
        imagePath = `courses/${courseId}-image-${Date.now()}.${imageFile.name.split('.').pop()}`
      }

      if (hoverImageFile) {
        hoverImageUrl = await uploadImage(hoverImageFile, courseId, 'hover')
        if (!hoverImageUrl) {
          alert('Failed to upload hover image')
          setUploading(false)
          return
        }
        hoverImagePath = `courses/${courseId}-hover-${Date.now()}.${hoverImageFile.name.split('.').pop()}`
      }

      if (certificateImageFile) {
        certificateImageUrl = await uploadImage(certificateImageFile, courseId, 'certificate')
        if (!certificateImageUrl) {
          alert('Failed to upload certificate image')
          setUploading(false)
          return
        }
        certificateImagePath = `courses/${courseId}-certificate-${Date.now()}.${certificateImageFile.name.split('.').pop()}`
      }

      if (catalogFile) {
        catalogFileUrl = await uploadCatalog(catalogFile, courseId)
        if (!catalogFileUrl) {
          alert('Failed to upload catalog file')
          setUploading(false)
          return
        }
        catalogFilePath = `catalogs/${courseId}-catalog-${Date.now()}.${catalogFile.name.split('.').pop()}`
      }

      // Auto-generate path from slug
      const autoPath = `/academics/${slug}`

      const courseData = {
        ...formData,
        slug,
        path: autoPath,
        image_url: imageUrl,
        hover_image_url: hoverImageUrl,
        certificate_image_url: certificateImageUrl,
        catalog_file_url: catalogFileUrl,
        image_path: imagePath,
        hover_image_path: hoverImagePath,
        certificate_image_path: certificateImagePath,
        catalog_file_path: catalogFilePath,
        hero_title: formData.hero_title || formData.title,
      }

      let savedCourseId = courseId

      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update({
            ...courseData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingCourse.id)

        if (error) throw error
        savedCourseId = editingCourse.id
      } else {
        const { data, error } = await supabase
          .from('courses')
          .insert([courseData])
          .select()
          .single()

        if (error) throw error
        if (data) savedCourseId = data.id
      }

      // After saving, load the course and show content management
      await fetchCourses()
      const savedCourse = courses.find(c => c.id === savedCourseId) || await fetchCourseById(savedCourseId)
      
      if (savedCourse) {
        setSelectedCourse(savedCourse)
        setEditingCourse(savedCourse)
        setShowForm(true)
        setActiveSection('overview')
        // Load course contents
        await fetchCourseContents(savedCourseId)
        alert('✅ Course saved successfully! You can now add course content.')
      } else {
        resetForm()
        alert('✅ Course saved successfully!')
      }
    } catch (error: any) {
      console.error('Error saving course:', error)
      alert(error.message || 'Failed to save')
    } finally {
      setUploading(false)
    }
  }

  const fetchCourseById = async (courseId: string): Promise<Course | null> => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching course:', error)
      return null
    }
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setSelectedCourse(course)
    setFormData({
      title: course.title,
      slug: course.slug,
      duration: course.duration || '',
      description: course.description || '',
      overview: course.overview || '',
      is_active: course.is_active,
      order_index: course.order_index,
      hero_title: course.hero_title || course.title,
      hero_description: course.hero_description || '',
      hero_duration_tag: course.hero_duration_tag || '',
      hero_format_tag: course.hero_format_tag || '',
      hero_degree_tag: course.hero_degree_tag || '',
      enroll_languages: course.enroll_languages || '',
      enroll_course_type: course.enroll_course_type || '',
      enroll_accredited: course.enroll_accredited ?? true,
      catalog_file_name: course.catalog_file_name || '',
      catalog_file_size: course.catalog_file_size || '',
    })
    setShowForm(true)
    setActiveSection('basic')
    fetchCourseContents(course.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all course content.')) return

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchCourses()
      if (selectedCourse?.id === id) {
        setSelectedCourse(null)
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }

  const handleSaveCurriculum = async () => {
    const courseId = editingCourse?.id || selectedCourse?.id
    if (!courseId) {
      alert('Please save the course first before adding curriculum')
      return
    }

    try {
      const existingContent = courseContents.find(c => c.content_type === 'curriculum')

      const metadata = { years: curriculumYears }
      const content = JSON.stringify(curriculumYears)

      if (existingContent) {
        const { error } = await supabase
          .from('course_content')
          .update({
            content,
            metadata,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingContent.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('course_content')
          .insert([{
            course_id: courseId,
            content_type: 'curriculum',
            content,
            metadata,
          }])

        if (error) throw error
      }

      await fetchCourseContents(courseId)
      alert('✅ Curriculum saved successfully!')
      console.log('Curriculum saved:', curriculumYears)
    } catch (error: any) {
      console.error('Error saving curriculum:', error)
      alert(error.message || 'Failed to save curriculum')
    }
  }

  const handleSaveRequirements = async () => {
    const courseId = editingCourse?.id || selectedCourse?.id
    if (!courseId) {
      alert('Please save the course first before adding requirements')
      return
    }

    try {
      const existingContent = courseContents.find(c => c.content_type === 'requirements')

      const metadata = { requirements }
      const content = JSON.stringify(requirements)

      if (existingContent) {
        const { error } = await supabase
          .from('course_content')
          .update({
            content,
            metadata,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingContent.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('course_content')
          .insert([{
            course_id: courseId,
            content_type: 'requirements',
            content,
            metadata,
          }])

        if (error) throw error
      }

      await fetchCourseContents(courseId)
      alert('✅ Requirements saved successfully!')
    } catch (error: any) {
      console.error('Error saving requirements:', error)
      alert(error.message || 'Failed to save requirements')
    }
  }

  const handleSaveContent = async (contentType: string, content: string, title?: string) => {
    const courseId = editingCourse?.id || selectedCourse?.id
    if (!courseId) {
      alert('Please save the course first before adding content')
      return
    }

    try {
      const existingContent = courseContents.find(c => c.content_type === contentType)

      if (existingContent) {
        const { error } = await supabase
          .from('course_content')
          .update({
            content,
            title: title || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingContent.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('course_content')
          .insert([{
            course_id: courseId,
            content_type: contentType,
            content,
            title: title || null,
          }])

        if (error) throw error
      }

      await fetchCourseContents(courseId)
      // Update overview content state if it's overview
      if (contentType === 'overview') {
        setOverviewContent(content)
      }
      alert('✅ Content saved successfully!')
      console.log('Content saved:', { contentType, content })
    } catch (error: any) {
      console.error('Error saving content:', error)
      alert(error.message || 'Failed to save content')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      duration: '',
      description: '',
      overview: '',
      is_active: true,
      order_index: 0,
      hero_title: '',
      hero_description: '',
      hero_duration_tag: '',
      hero_format_tag: '',
      hero_degree_tag: '',
      enroll_languages: '',
      enroll_course_type: '',
      enroll_accredited: true,
      catalog_file_name: '',
      catalog_file_size: '',
    })
    setImageFile(null)
    setHoverImageFile(null)
    setCertificateImageFile(null)
    setCatalogFile(null)
    setEditingCourse(null)
    setShowForm(false)
    setActiveSection('basic')
    setSelectedCourse(null)
    setOverviewContent('')
  }

  const addTopicToYear = (yearIndex: number) => {
    const newYears = [...curriculumYears]
    newYears[yearIndex].topics.push('')
    setCurriculumYears(newYears)
  }

  const updateTopic = (yearIndex: number, topicIndex: number, value: string) => {
    const newYears = [...curriculumYears]
    newYears[yearIndex].topics[topicIndex] = value
    setCurriculumYears(newYears)
  }

  const removeTopic = (yearIndex: number, topicIndex: number) => {
    const newYears = [...curriculumYears]
    newYears[yearIndex].topics.splice(topicIndex, 1)
    setCurriculumYears(newYears)
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>
  }

  // All menu items - combining form and content
  const allMenuItems = [
    { id: 'basic' as const, label: 'Basic Information', icon: '📝', required: true, category: 'setup' },
    { id: 'hero' as const, label: 'Hero Section', icon: '🎯', required: false, category: 'setup' },
    { id: 'enroll' as const, label: 'Enroll Card', icon: '🎓', required: true, category: 'setup' },
    { id: 'catalog' as const, label: 'Course Catalog', icon: '📄', required: false, category: 'setup' },
    { id: 'overview' as const, label: 'Overview', icon: '📋', required: false, category: 'content' },
    { id: 'curriculum' as const, label: 'Curriculum', icon: '📚', required: false, category: 'content' },
    { id: 'requirements' as const, label: 'Requirements', icon: '✅', required: false, category: 'content' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#15133D]">Courses Management</h2>
          <p className="text-gray-600 mt-1">Manage courses and course detail pages</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
            setActiveSection('basic')
          }}
          className="px-6 py-3 bg-[#15133D] text-white rounded-lg hover:bg-[#1a1650] transition-colors font-medium shadow-md"
        >
          + Add New Course
        </button>
      </div>

      {/* Main Content Area */}
      {showForm ? (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex h-[calc(100vh-250px)] min-h-[600px]">
            {/* Improved Sidebar Navigation */}
            <aside className="w-72 bg-gradient-to-b from-[#15133D] to-[#1a1650] text-white flex flex-col shadow-xl">
              <div className="p-6 border-b border-[#1a1650]">
                <h3 className="text-white font-bold text-xl mb-1">
                  {editingCourse ? 'Edit Course' : 'New Course'}
                </h3>
                <p className="text-gray-300 text-sm">Complete all required sections</p>
              </div>
              
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {/* Course Setup Section */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Course Setup</p>
                  {allMenuItems.filter(item => item.category === 'setup').map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left mb-1 ${
                        activeSection === item.id
                          ? 'bg-white text-[#15133D] shadow-lg transform scale-105'
                          : 'text-gray-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{item.label}</span>
                          {item.required && (
                            <span className="text-red-400 text-xs font-bold">*</span>
                          )}
                        </div>
                      </div>
                      {activeSection === item.id && (
                        <div className="w-2 h-2 bg-[#15133D] rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Course Content Section */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Course Content</p>
                  {allMenuItems.filter(item => item.category === 'content').map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left mb-1 ${
                        activeSection === item.id
                          ? 'bg-white text-[#15133D] shadow-lg transform scale-105'
                          : 'text-gray-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-semibold text-sm">{item.label}</span>
                      {activeSection === item.id && (
                        <div className="w-2 h-2 bg-[#15133D] rounded-full ml-auto"></div>
                      )}
                    </button>
                  ))}
                </div>
              </nav>

              <div className="p-4 border-t border-[#1a1650] bg-[#1a1650]">
                <div className="p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
                  <p className="text-xs text-yellow-200 font-medium">
                    <strong>Required:</strong> Basic Info & Enroll Card
                  </p>
                </div>
              </div>
            </aside>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              <form onSubmit={handleSubmit} className="p-8">
                {/* Basic Information */}
                {activeSection === 'basic' && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-2xl font-bold text-[#15133D] mb-6 flex items-center gap-3">
                        <span className="text-3xl">📝</span> Basic Information
                      </h3>
                      
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Course Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => {
                              setFormData({ ...formData, title: e.target.value })
                              if (!editingCourse) {
                                setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))
                              }
                            }}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                            placeholder="e.g., Bachelor of Theology"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Slug (URL) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                            placeholder="bachelor-of-theology"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            URL: <span className="font-mono">/academics/{formData.slug || 'your-slug'}</span>
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Duration</label>
                            <input
                              type="text"
                              value={formData.duration}
                              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                              placeholder="e.g., 4 years"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Display Order</label>
                            <input
                              type="number"
                              value={formData.order_index}
                              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                            placeholder="Brief description of the course"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Overview</label>
                          <textarea
                            value={formData.overview}
                            onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                            placeholder="Detailed course overview"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Course Image <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, 'image')}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                              required={!editingCourse?.image_url}
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended: 800x600px, max 5MB</p>
                            {editingCourse?.image_url && !imageFile && (
                              <div className="mt-3">
                                <img src={editingCourse.image_url} alt="Current" className="h-32 w-full object-cover rounded-lg border-2 border-gray-200" />
                                <p className="text-xs text-gray-500 mt-1">Current image</p>
                              </div>
                            )}
                            {imageFile && (
                              <div className="mt-3">
                                <img src={URL.createObjectURL(imageFile)} alt="Preview" className="h-32 w-full object-cover rounded-lg border-2 border-green-300" />
                                <p className="text-xs text-green-600 mt-1 font-medium">✓ New image selected</p>
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Hover Image (Optional)</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, 'hover')}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1">Shows on hover, same size as course image</p>
                            {editingCourse?.hover_image_url && !hoverImageFile && (
                              <div className="mt-3">
                                <img src={editingCourse.hover_image_url} alt="Current" className="h-32 w-full object-cover rounded-lg border-2 border-gray-200" />
                              </div>
                            )}
                            {hoverImageFile && (
                              <div className="mt-3">
                                <img src={URL.createObjectURL(hoverImageFile)} alt="Preview" className="h-32 w-full object-cover rounded-lg border-2 border-green-300" />
                                <p className="text-xs text-green-600 mt-1 font-medium">✓ New image selected</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-5 h-5 text-[#15133D] border-gray-300 rounded focus:ring-[#15133D]"
                          />
                          <label htmlFor="is_active" className="ml-3 text-sm font-medium text-gray-700">
                            Course is active (visible on website)
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hero Section */}
                {activeSection === 'hero' && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-2xl font-bold text-[#15133D] mb-6 flex items-center gap-3">
                        <span className="text-3xl">🎯</span> Hero Section
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">Configure the hero section that appears at the top of the course page</p>
                      
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Hero Title</label>
                          <input
                            type="text"
                            value={formData.hero_title}
                            onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                            placeholder="Leave empty to use course title"
                          />
                          <p className="text-xs text-gray-500 mt-1">If empty, will automatically use the course title</p>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Hero Description</label>
                          <textarea
                            value={formData.hero_description}
                            onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                            placeholder="Description shown in the hero section"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Duration Tag</label>
                            <input
                              type="text"
                              value={formData.hero_duration_tag}
                              onChange={(e) => setFormData({ ...formData, hero_duration_tag: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                              placeholder="e.g., 4 years"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Format Tag</label>
                            <input
                              type="text"
                              value={formData.hero_format_tag}
                              onChange={(e) => setFormData({ ...formData, hero_format_tag: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                              placeholder="e.g., Hybrid, Online"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Degree Tag</label>
                            <input
                              type="text"
                              value={formData.hero_degree_tag}
                              onChange={(e) => setFormData({ ...formData, hero_degree_tag: e.target.value })}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                              placeholder="e.g., Bachelor of Theology (B.Th.)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enroll Card */}
                {activeSection === 'enroll' && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-2xl font-bold text-[#15133D] mb-6 flex items-center gap-3">
                        <span className="text-3xl">🎓</span> Enroll Card
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">Configure the enrollment card that appears on the course page</p>
                      
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Certificate Image <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'certificate')}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                            required={!editingCourse?.certificate_image_url}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            <strong>Required:</strong> 800x600px (or close), max 5MB. This appears in the enroll card.
                          </p>
                          {editingCourse?.certificate_image_url && !certificateImageFile && (
                            <div className="mt-3">
                              <img src={editingCourse.certificate_image_url} alt="Current" className="h-40 w-full object-contain rounded-lg border-2 border-gray-200 bg-gray-50 p-2" />
                              <p className="text-xs text-gray-500 mt-1">Current certificate image</p>
                            </div>
                          )}
                          {certificateImageFile && (
                            <div className="mt-3">
                              <img src={URL.createObjectURL(certificateImageFile)} alt="Preview" className="h-40 w-full object-contain rounded-lg border-2 border-green-300 bg-gray-50 p-2" />
                              <p className="text-xs text-green-600 mt-1 font-medium">✓ New image selected (will replace current)</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Languages <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.enroll_languages}
                            onChange={(e) => setFormData({ ...formData, enroll_languages: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                            placeholder="e.g., English & Tamil"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Course Type <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.enroll_course_type}
                            onChange={(e) => setFormData({ ...formData, enroll_course_type: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                            placeholder="e.g., Full-time / Residential / On-Campus"
                            required
                          />
                        </div>

                        <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <input
                            type="checkbox"
                            id="enroll_accredited"
                            checked={formData.enroll_accredited}
                            onChange={(e) => setFormData({ ...formData, enroll_accredited: e.target.checked })}
                            className="w-5 h-5 text-[#15133D] border-gray-300 rounded focus:ring-[#15133D]"
                          />
                          <label htmlFor="enroll_accredited" className="ml-3 text-sm font-medium text-gray-700">
                            Course is accredited
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Catalog */}
                {activeSection === 'catalog' && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-2xl font-bold text-[#15133D] mb-6 flex items-center gap-3">
                        <span className="text-3xl">📄</span> Course Catalog
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">Upload a PDF catalog for students to download</p>
                      
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Course Catalog PDF</label>
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleCatalogFileChange}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                          />
                          <p className="text-xs text-gray-500 mt-1">Max 10MB, PDF format only</p>
                          {editingCourse?.catalog_file_url && !catalogFile && (
                            <div className="mt-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                              <p className="text-sm font-medium text-gray-700">Current: {editingCourse.catalog_file_name || 'Catalog file'}</p>
                              <a href={editingCourse.catalog_file_url} target="_blank" rel="noopener noreferrer" className="text-[#15133D] text-sm hover:underline font-medium mt-2 inline-block">
                                View current file →
                              </a>
                            </div>
                          )}
                          {catalogFile && (
                            <div className="mt-3 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                              <p className="text-sm font-medium text-green-800">
                                ✓ Selected: {formData.catalog_file_name} ({formData.catalog_file_size})
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Overview */}
                {activeSection === 'overview' && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-2xl font-bold text-[#15133D] mb-6 flex items-center gap-3">
                        <span className="text-3xl">📋</span> Course Overview
                      </h3>
                      <textarea
                        value={overviewContent || courseContents.find(c => c.content_type === 'overview')?.content || editingCourse?.overview || formData.overview || ''}
                        onChange={(e) => setOverviewContent(e.target.value)}
                        rows={12}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                        placeholder="Enter detailed course overview..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleSaveContent('overview', overviewContent || courseContents.find(c => c.content_type === 'overview')?.content || editingCourse?.overview || formData.overview || '')
                        }}
                        className="mt-4 px-6 py-3 bg-[#15133D] text-white rounded-lg hover:bg-[#1a1650] transition-colors font-semibold shadow-md"
                      >
                        💾 Save Overview
                      </button>
                    </div>
                  </div>
                )}

                {/* Curriculum */}
                {activeSection === 'curriculum' && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-2xl font-bold text-[#15133D] mb-4 flex items-center gap-3">
                        <span className="text-3xl">📚</span> Curriculum Structure
                      </h3>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                        <p className="text-sm text-blue-800 mb-2">
                          <strong>How it works:</strong> Add curriculum details for each year. Topics will appear in an <strong>accordion</strong> on the course page (visitors click to expand).
                        </p>
                        <p className="text-sm text-blue-700">
                          💡 <strong>Tip:</strong> Topics are optional. You can leave them empty if you only want to show the year title.
                        </p>
                      </div>

                      {curriculumYears.map((year, yearIndex) => (
                        <div key={yearIndex} className="border-2 border-gray-200 rounded-lg p-5 bg-gray-50 mb-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">Year Label</label>
                              <input
                                type="text"
                                value={year.year}
                                onChange={(e) => {
                                  const newYears = [...curriculumYears]
                                  newYears[yearIndex].year = e.target.value
                                  setCurriculumYears(newYears)
                                }}
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                                placeholder="e.g., 1st year"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">Year Title</label>
                              <input
                                type="text"
                                value={year.title}
                                onChange={(e) => {
                                  const newYears = [...curriculumYears]
                                  newYears[yearIndex].title = e.target.value
                                  setCurriculumYears(newYears)
                                }}
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                                placeholder="e.g., Foundations of Theology"
                              />
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Year Color</label>
                            <select
                              value={year.color}
                              onChange={(e) => {
                                const newYears = [...curriculumYears]
                                newYears[yearIndex].color = e.target.value
                                setCurriculumYears(newYears)
                              }}
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                            >
                              <option value="#2B7FFF">Blue</option>
                              <option value="#60A563">Green</option>
                              <option value="#AD46FF">Purple</option>
                              <option value="#F0B100">Yellow</option>
                              <option value="#FF6B6B">Red</option>
                              <option value="#4ECDC4">Teal</option>
                              <option value="#FF8C42">Orange</option>
                              <option value="#6C5CE7">Violet</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Topics (Optional - appear in accordion)
                            </label>
                            {year.topics.length === 0 && (
                              <div className="mb-3 p-3 bg-gray-100 rounded-lg border border-gray-200">
                                <p className="text-xs text-gray-600 italic">
                                  No topics yet. Click "Add Topic" to add curriculum topics for this year.
                                </p>
                              </div>
                            )}
                            {year.topics.map((topic, topicIndex) => (
                              <div key={topicIndex} className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={topic}
                                  onChange={(e) => updateTopic(yearIndex, topicIndex, e.target.value)}
                                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                                  placeholder="Enter topic name"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeTopic(yearIndex, topicIndex)}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium whitespace-nowrap"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addTopicToYear(yearIndex)}
                              className="mt-2 px-4 py-2 bg-[#15133D] text-white rounded-lg hover:bg-[#1a1650] text-sm font-medium"
                            >
                              + Add Topic to {year.year || 'Year'}
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleSaveCurriculum}
                        className="px-6 py-3 bg-[#15133D] text-white rounded-lg hover:bg-[#1a1650] transition-colors font-semibold shadow-md"
                      >
                        💾 Save Curriculum
                      </button>
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {activeSection === 'requirements' && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-2xl font-bold text-[#15133D] mb-6 flex items-center gap-3">
                        <span className="text-3xl">✅</span> Course Requirements
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">Configure admission requirements displayed on the course page</p>

                      {requirements.map((req, index) => (
                        <div key={index} className="border-2 border-gray-200 rounded-lg p-5 bg-gray-50 mb-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">Requirement Title</label>
                              <input
                                type="text"
                                value={req.title}
                                onChange={(e) => {
                                  const newReqs = [...requirements]
                                  newReqs[index].title = e.target.value
                                  setRequirements(newReqs)
                                }}
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                                placeholder="e.g., 12th Grade Completion Certificate"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">Icon Type</label>
                              <select
                                value={req.icon}
                                onChange={(e) => {
                                  const newReqs = [...requirements]
                                  newReqs[index].icon = e.target.value
                                  setRequirements(newReqs)
                                }}
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                              >
                                <option value="school">School</option>
                                <option value="certificate">Certificate</option>
                                <option value="document">Document</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Card Style</label>
                            <select
                              value={`${req.bgColor}-${req.borderColor}`}
                              onChange={(e) => {
                                const [bgColor, borderColor] = e.target.value.split('-')
                                const newReqs = [...requirements]
                                newReqs[index].bgColor = bgColor
                                newReqs[index].borderColor = borderColor
                                setRequirements(newReqs)
                              }}
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-[#15133D] transition-all"
                            >
                              <option value="#EFF6FF-#155DFC">Blue Style</option>
                              <option value="#F0FDF4-#00A63E">Green Style</option>
                              <option value="#FAF5FF-#9810FA">Purple Style</option>
                              <option value="#FFF5F5-#EF4444">Red Style</option>
                              <option value="#F0F9FF-#0EA5E9">Sky Blue Style</option>
                              <option value="#FEF3C7-#F59E0B">Amber Style</option>
                            </select>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleSaveRequirements}
                        className="px-6 py-3 bg-[#15133D] text-white rounded-lg hover:bg-[#1a1650] transition-colors font-semibold shadow-md"
                      >
                        💾 Save Requirements
                      </button>
                    </div>
                  </div>
                )}

                {/* Form Actions - Sticky */}
                <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-6 -mx-8 -mb-8 flex gap-4 shadow-lg mt-8">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-6 py-3 bg-[#15133D] text-white rounded-lg hover:bg-[#1a1650] transition-colors disabled:opacity-50 font-semibold shadow-md"
                  >
                    {uploading ? '⏳ Saving...' : editingCourse ? '💾 Update Course' : '✅ Create Course'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (editingCourse) {
                        setShowForm(false)
                        setSelectedCourse(editingCourse)
                      } else {
                        resetForm()
                      }
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* Course List View */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Courses List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#15133D] to-[#1a1650]">
                <h3 className="font-bold text-white text-lg">Courses ({courses.length})</h3>
              </div>
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => {
                      setSelectedCourse(course)
                      setShowForm(true)
                      handleEdit(course)
                    }}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-all ${
                      selectedCourse?.id === course.id 
                        ? 'bg-[#15133D] text-white' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`font-semibold ${selectedCourse?.id === course.id ? 'text-white' : 'text-gray-900'}`}>
                          {course.title}
                        </p>
                        <p className={`text-xs mt-1 ${selectedCourse?.id === course.id ? 'text-gray-200' : 'text-gray-500'}`}>
                          {course.duration || 'No duration'}
                        </p>
                        {!course.is_active && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Course Details View */}
          <div className="lg:col-span-3">
            {selectedCourse ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#15133D]">{selectedCourse.title}</h3>
                    <p className="text-gray-600 mt-1">{selectedCourse.duration || 'No duration'}</p>
                    <p className="text-sm text-gray-500 mt-1">Slug: {selectedCourse.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowForm(true)
                        handleEdit(selectedCourse)
                      }}
                      className="px-4 py-2 bg-[#15133D] text-white rounded-lg hover:bg-[#1a1650] transition-colors text-sm font-medium"
                    >
                      Edit Course
                    </button>
                    <button
                      onClick={() => handleDelete(selectedCourse.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Show All Course Details */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="border-2 border-gray-200 rounded-lg p-5">
                    <h4 className="font-bold text-lg text-[#15133D] mb-4">Basic Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Title</p>
                        <p className="text-gray-900">{selectedCourse.title}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Duration</p>
                        <p className="text-gray-900">{selectedCourse.duration || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Slug</p>
                        <p className="text-gray-900 font-mono text-sm">{selectedCourse.slug}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">Status</p>
                        <p className="text-gray-900">{selectedCourse.is_active ? 'Active' : 'Inactive'}</p>
                      </div>
                    </div>
                    {selectedCourse.description && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-600">Description</p>
                        <p className="text-gray-900 mt-1">{selectedCourse.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Hero Section Details */}
                  {(selectedCourse.hero_title || selectedCourse.hero_description || selectedCourse.hero_duration_tag) && (
                    <div className="border-2 border-gray-200 rounded-lg p-5">
                      <h4 className="font-bold text-lg text-[#15133D] mb-4">Hero Section</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedCourse.hero_title && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Hero Title</p>
                            <p className="text-gray-900">{selectedCourse.hero_title}</p>
                          </div>
                        )}
                        {selectedCourse.hero_duration_tag && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Duration Tag</p>
                            <p className="text-gray-900">{selectedCourse.hero_duration_tag}</p>
                          </div>
                        )}
                        {selectedCourse.hero_format_tag && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Format Tag</p>
                            <p className="text-gray-900">{selectedCourse.hero_format_tag}</p>
                          </div>
                        )}
                        {selectedCourse.hero_degree_tag && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Degree Tag</p>
                            <p className="text-gray-900">{selectedCourse.hero_degree_tag}</p>
                          </div>
                        )}
                      </div>
                      {selectedCourse.hero_description && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-gray-600">Hero Description</p>
                          <p className="text-gray-900 mt-1">{selectedCourse.hero_description}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Enroll Card Details */}
                  {(selectedCourse.enroll_languages || selectedCourse.enroll_course_type || selectedCourse.certificate_image_url) && (
                    <div className="border-2 border-gray-200 rounded-lg p-5">
                      <h4 className="font-bold text-lg text-[#15133D] mb-4">Enroll Card</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedCourse.enroll_languages && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Languages</p>
                            <p className="text-gray-900">{selectedCourse.enroll_languages}</p>
                          </div>
                        )}
                        {selectedCourse.enroll_course_type && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Course Type</p>
                            <p className="text-gray-900">{selectedCourse.enroll_course_type}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-600">Accredited</p>
                          <p className="text-gray-900">{selectedCourse.enroll_accredited ? 'Yes' : 'No'}</p>
                        </div>
                        {selectedCourse.certificate_image_url && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600 mb-2">Certificate Image</p>
                            <img src={selectedCourse.certificate_image_url} alt="Certificate" className="h-24 w-full object-contain rounded border" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Catalog Details */}
                  {selectedCourse.catalog_file_url && (
                    <div className="border-2 border-gray-200 rounded-lg p-5">
                      <h4 className="font-bold text-lg text-[#15133D] mb-4">Course Catalog</h4>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">File Name</p>
                        <p className="text-gray-900">{selectedCourse.catalog_file_name || 'Catalog file'}</p>
                        {selectedCourse.catalog_file_size && (
                          <p className="text-sm text-gray-500 mt-1">Size: {selectedCourse.catalog_file_size}</p>
                        )}
                        <a href={selectedCourse.catalog_file_url} target="_blank" rel="noopener noreferrer" className="text-[#15133D] text-sm hover:underline font-medium mt-2 inline-block">
                          View/Download Catalog →
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Course Content Summary */}
                  <div className="border-2 border-gray-200 rounded-lg p-5">
                    <h4 className="font-bold text-lg text-[#15133D] mb-4">Course Content</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium">Overview</span>
                        <span className="text-sm text-gray-600">
                          {courseContents.find(c => c.content_type === 'overview')?.content ? '✓ Saved' : 'Not set'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium">Curriculum</span>
                        <span className="text-sm text-gray-600">
                          {courseContents.find(c => c.content_type === 'curriculum')?.metadata?.years ? '✓ Saved' : 'Not set'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium">Requirements</span>
                        <span className="text-sm text-gray-600">
                          {courseContents.find(c => c.content_type === 'requirements')?.metadata?.requirements ? '✓ Saved' : 'Not set'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowForm(true)
                        handleEdit(selectedCourse)
                        setActiveSection('overview')
                      }}
                      className="mt-4 w-full px-4 py-2 bg-[#15133D] text-white rounded-lg hover:bg-[#1a1650] transition-colors font-medium"
                    >
                      Manage Course Content
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Course Selected</h3>
                <p className="text-gray-500">Select a course from the list to view all details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!showForm && courses.length === 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">No courses yet. Click "Add New Course" to get started!</p>
        </div>
      )}
    </div>
  )
}

export default CoursesManagement
