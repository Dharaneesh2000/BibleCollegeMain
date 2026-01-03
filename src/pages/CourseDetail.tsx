import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import CourseHero from '../components/CourseHero'
import CourseOverview from '../components/CourseOverview'
import CurriculumStructure from '../components/CurriculumStructure'
import CourseCatalog from '../components/CourseCatalog'
import CourseRequirements from '../components/CourseRequirements'
import ContactSection from '../components/ContactSection'
import EnrollCard from '../components/EnrollCard'
import SEO from '../components/SEO'
import { getCourseStructuredData, getBreadcrumbStructuredData } from '../utils/seoData'

interface Course {
  id: string
  title: string
  slug: string
  duration: string | null
  overview: string | null
  hero_title: string | null
  hero_description: string | null
  hero_duration_tag: string | null
  hero_format_tag: string | null
  hero_degree_tag: string | null
  certificate_image_url: string | null
  enroll_languages: string | null
  enroll_course_type: string | null
  enroll_accredited: boolean | null
  catalog_file_url: string | null
  catalog_file_name: string | null
  catalog_file_size: string | null
}

interface CourseContent {
  content_type: string
  content: string
  metadata: any
}

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [courseContents, setCourseContents] = useState<CourseContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchCourseData(slug)
    }
  }, [slug])

  const fetchCourseData = async (courseSlug: string) => {
    try {
      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', courseSlug)
        .eq('is_active', true)
        .single()

      if (courseError) throw courseError

      if (courseData) {
        setCourse(courseData)

        // Fetch course content
        const { data: contentData, error: contentError } = await supabase
          .from('course_content')
          .select('content_type, content, metadata')
          .eq('course_id', courseData.id)

        if (contentError) throw contentError
        setCourseContents(contentData || [])
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h1>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Get content from course_content table
  const overviewContent = courseContents.find(c => c.content_type === 'overview')?.content || course.overview || ''
  const curriculumData = courseContents.find(c => c.content_type === 'curriculum')?.metadata?.years
  const requirementsData = courseContents.find(c => c.content_type === 'requirements')?.metadata?.requirements

  // SEO data
  const courseDescription = course.hero_description || overviewContent.substring(0, 160) || `${course.title} at God's Will Bible College. Residential theological education in Rourkela, Odisha.`
  const courseUrl = `https://godswillbiblecollege.com/academics/${course.slug}`
  
  const courseStructuredData = getCourseStructuredData({
    title: course.title,
    description: courseDescription,
    duration: course.duration || undefined,
    url: courseUrl
  })

  const breadcrumbData = getBreadcrumbStructuredData([
    { name: "Home", url: "https://godswillbiblecollege.com" },
    { name: "Browse Courses", url: "https://godswillbiblecollege.com/academics" },
    { name: course.title, url: courseUrl }
  ])

  const combinedStructuredData = {
    "@context": "https://schema.org",
    "@graph": [courseStructuredData, breadcrumbData]
  }

  return (
    <div className="bg-white">
      <SEO
        title={`${course.title} - God's Will Bible College | ${course.duration || 'Theology Program'}`}
        description={courseDescription}
        keywords={`${course.title}, theology course, Bible college program, ${course.duration || 'theology degree'}, Christian ministry training, Rourkela, Odisha, theological education`}
        url={courseUrl}
        image="/images/BannerImage.png"
        type="article"
        structuredData={combinedStructuredData}
      />
      {/* Hero Section */}
      <CourseHero
        title={course.hero_title || course.title}
        description={course.hero_description || ''}
        durationTag={course.hero_duration_tag || course.duration || ''}
        formatTag={course.hero_format_tag || ''}
        degreeTag={course.hero_degree_tag || ''}
      />

      {/* Main content */}
      <div className="relative">
        <div className="mx-auto px-1 md:px-2 lg:px-1" style={{ maxWidth: '95%' }}>
          {/* Flex layout for 65/35 split */}
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* LEFT SIDE - 65% */}
            <div className="w-full lg:w-[65%]">
              <CourseOverview content={overviewContent} />
              <CurriculumStructure years={curriculumData} />
              <CourseCatalog
                fileUrl={course.catalog_file_url}
                fileName={course.catalog_file_name}
                fileSize={course.catalog_file_size}
              />
              <CourseRequirements requirements={requirementsData} />
            </div>

            {/* RIGHT SIDE - 35% */}
            <div className="w-full lg:w-[35%] flex justify-end pr-4 lg:pr-8">
              {/* Sticky Enroll Card - overlaps hero, stops at CourseRequirements */}
              <div className="sticky top-24 self-start -mt-[17rem]">
                <EnrollCard
                  title={course.title}
                  duration={course.duration || ''}
                  languages={course.enroll_languages || ''}
                  courseType={course.enroll_course_type || ''}
                  accredited={course.enroll_accredited ?? true}
                  certificateImageUrl={course.certificate_image_url}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Contact Section */}
      <ContactSection />
    </div>
  )
}

export default CourseDetail