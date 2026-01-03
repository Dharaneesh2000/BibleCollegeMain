import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BOTA from '../../assets/images/BOTA.png'
import BOTB from '../../assets/images/BOTB.png'
import { supabase } from '../lib/supabase'
import SEO from '../components/SEO'
import { getBreadcrumbStructuredData } from '../utils/seoData'
import LazyImage from '../components/LazyImage'

interface Course {
  id: string
  title: string
  duration: string | null
  image_url: string | null
  hover_image_url: string | null
  path: string | null
  slug: string
}

const BrowseCourses = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, duration, image_url, hover_image_url, path, slug')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        setCourses(data)
      } else {
        // Fallback to static data if database is empty
        setCourses([
          {
            id: 'bachelor-of-theology',
            title: 'Bachelor of Theology',
            duration: '4 years',
            image_url: BOTA,
            hover_image_url: BOTB,
            path: '/academics/bachelor-of-theology',
            slug: 'bachelor-of-theology'
          },
          {
            id: 'bachelor-of-theology-2',
            title: 'Bachelor of Theology',
            duration: '4 years',
            image_url: BOTB,
            hover_image_url: BOTA,
            path: '/academics/bachelor-of-theology',
            slug: 'bachelor-of-theology-2'
          },
          {
            id: 'bachelor-of-theology-3',
            title: 'Bachelor of Theology',
            duration: '4 years',
            image_url: BOTA,
            hover_image_url: BOTB,
            path: '/academics/bachelor-of-theology',
            slug: 'bachelor-of-theology-3'
          },
          {
            id: 'bachelor-of-theology-4',
            title: 'Bachelor of Theology',
            duration: '4 years',
            image_url: BOTB,
            hover_image_url: BOTA,
            path: '/academics/bachelor-of-theology',
            slug: 'bachelor-of-theology-4'
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      // On error, use fallback static data
      setCourses([
        {
          id: 'bachelor-of-theology',
          title: 'Bachelor of Theology',
          duration: '4 years',
          image_url: BOTA,
          hover_image_url: BOTB,
          path: '/academics/bachelor-of-theology',
          slug: 'bachelor-of-theology'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const breadcrumbData = getBreadcrumbStructuredData([
    { name: "Home", url: "https://godswillbiblecollege.com" },
    { name: "Browse Courses", url: "https://godswillbiblecollege.com/academics" }
  ])

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Browse Courses - God's Will Bible College | Theology Programs"
        description="Explore our comprehensive theology programs at God's Will Bible College. Browse our courses including Bachelor of Theology and other ministry training programs designed for Christian service across India."
        keywords="theology courses, Bible college programs, Christian ministry courses, theology degree programs, Bible college curriculum, ministry training courses, theological education programs"
        url="https://godswillbiblecollege.com/academics"
        image="/images/BannerImage.png"
        structuredData={breadcrumbData}
      />
      <div className="container mx-auto px-4 py-16">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-[34px] font-[700] text-[#333333] mb-4 md:mb-0">
            Browse Courses
          </h1>

          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012659] focus:border-transparent"
            />
          </div>
        </div>

        {/* Split Border */}
        <div className="border-t border-[#E6E6E6] mb-8"></div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[18px] font-[400] text-[#636363]">
              No courses found matching "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <Link
                key={course.id}
                to={course.path || `/academics/${course.slug}`}
                className="group border border-[#E6E6E6] rounded-lg overflow-hidden transform transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Course Image */}
                <div className="relative overflow-hidden h-64">
                  <LazyImage
                    src={course.image_url || BOTA}
                    alt={`${course.title} - ${course.duration || 'Theology program'} at God's Will Bible College`}
                    className="w-full h-full object-cover absolute top-0 left-0 transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
                    width="400"
                    height="256"
                  />
                  {course.hover_image_url && (
                    <LazyImage
                      src={course.hover_image_url}
                      alt={`${course.title} course details - God's Will Bible College`}
                      className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                      width="400"
                      height="256"
                    />
                  )}
                </div>

                {/* Course Info */}
                <div className="p-4">
                  <h3 className="text-[22px] font-[600] text-[#333333] mb-2 transition-colors duration-300 group-hover:text-[#012659]">
                    {course.title}
                  </h3>
                  {course.duration && (
                    <div className="flex items-center text-[14px] font-[500] text-[#333333]">
                      <svg
                        className="w-4 h-4 mr-2 text-[#012659]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{course.duration}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default BrowseCourses
