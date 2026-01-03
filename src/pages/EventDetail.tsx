import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import DownloadIcon from '@mui/icons-material/Download'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import LazyImage from '../components/LazyImage'
import SEO from '../components/SEO'

interface Event {
  id: string
  title: string
  description: string
  date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  image_url: string | null
  hero_image_url: string | null
  about_content: string | null
  what_to_expect: string[] | null
  download_resources_url: string | null
  download_resources_file_name: string | null
  speakers: any[] | null
  is_active: boolean
}

interface RelatedEvent {
  id: string
  title: string
  description: string
  date: string
  image_url: string | null
  start_time: string | null
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [relatedEvents, setRelatedEvents] = useState<RelatedEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchEventData(id)
      fetchRelatedEvents(id)
    }
  }, [id])

  const fetchEventData = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('news_events')
        .select('*')
        .eq('id', eventId)
        .eq('is_active', true)
        .single()

      if (error) throw error

      if (data) {
        // Parse JSON fields if they're stored as strings
        const parsedData = {
          ...data,
          what_to_expect: typeof data.what_to_expect === 'string' 
            ? JSON.parse(data.what_to_expect || '[]') 
            : data.what_to_expect || [],
          speakers: typeof data.speakers === 'string'
            ? JSON.parse(data.speakers || '[]')
            : data.speakers || []
        }
        setEvent(parsedData)
      }
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedEvents = async (currentEventId: string) => {
    try {
      const { data, error } = await supabase
        .from('news_events')
        .select('id, title, description, date, image_url, start_time')
        .eq('is_active', true)
        .neq('id', currentEventId)
        .order('date', { ascending: false })
        .limit(3)

      if (error) throw error
      setRelatedEvents(data || [])
    } catch (error) {
      console.error('Error fetching related events:', error)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return ''
    try {
      // Handle both "HH:MM" and "HH:MM:SS" formats
      const [hours, minutes] = timeString.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    } catch {
      return timeString
    }
  }

  const formatTimeRange = (start: string | null, end: string | null) => {
    if (!start) return ''
    const startTime = formatTime(start)
    const endTime = end ? formatTime(end) : ''
    return endTime ? `${startTime} - ${endTime}` : startTime
  }

  const formatCardDate = (dateString: string, timeString: string | null) => {
    try {
      const date = new Date(dateString)
      const day = date.getDate()
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      const year = date.getFullYear()
      const time = timeString ? formatTime(timeString) : ''
      return `${day} ${month}, ${year}${time ? ` | ${time}` : ''}`
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
          <Link to="/news" className="text-bible-blue hover:underline">
            ← Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const eventDescription = event.description || event.about_content || `${event.title} at God's Will Bible College`
  const eventUrl = `https://godswillbiblecollege.com/news/${event.id}`

  return (
    <div className="bg-white">
      <SEO
        title={`${event.title} - God's Will Bible College`}
        description={eventDescription.substring(0, 160)}
        keywords={`${event.title}, Bible college event, Christian event, ${event.location || 'Rourkela'}, Odisha, theological event`}
        url={eventUrl}
        image={event.hero_image_url || event.image_url || "/images/BannerImage.png"}
        type="article"
      />

      {/* Hero Section */}
      <div className="relative w-full h-[300px] overflow-hidden">
        <LazyImage
          src={event.hero_image_url || event.image_url || "/images/Events.png"}
          alt={event.title}
          className="w-full h-full object-cover"
          width="1920"
          height="300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CalendarTodayIcon />
              <span>{formatDate(event.date)}</span>
            </div>
            {(event.start_time || event.end_time) && (
              <div className="flex items-center gap-3">
                <AccessTimeIcon />
                <span>{formatTimeRange(event.start_time, event.end_time)}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-3">
                <LocationOnIcon />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 md:px-12 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* About this Event */}
          <div>
            <h2 className="text-2xl font-bold text-[#1A2633] mb-6">About this Event</h2>
            <div className="text-[#333333] leading-relaxed whitespace-pre-wrap">
              {event.about_content || event.description}
            </div>
          </div>

          {/* What to Expect */}
          <div>
            <h2 className="text-2xl font-bold text-[#1A2633] mb-6">What to Expect</h2>
            {event.what_to_expect && event.what_to_expect.length > 0 ? (
              <ul className="space-y-3 mb-6">
                {event.what_to_expect.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-bible-blue mt-2 flex-shrink-0" />
                    <span className="text-[#333333]">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#333333] mb-6">More details coming soon.</p>
            )}
            {event.download_resources_url && (
              <a
                href={event.download_resources_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#15133D] text-white rounded-lg hover:bg-[#1a1650] transition-colors font-medium"
              >
                Download Resources
                <DownloadIcon style={{ color: "#ffffff" }} />
              </a>
            )}
          </div>
        </div>

        {/* Speaker Details */}
        {event.speakers && event.speakers.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-[#1A2633] mb-8">Speaker Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {event.speakers.map((speaker, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  {speaker.image_url && (
                    <div className="mb-4">
                      <LazyImage
                        src={speaker.image_url}
                        alt={speaker.name || 'Speaker'}
                        className="w-24 h-24 rounded-full object-cover mx-auto"
                        width="96"
                        height="96"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-[#1A2633] mb-2 text-center">
                    {speaker.name || 'Speaker'}
                  </h3>
                  <p className="text-[#333333] text-sm text-center">
                    {speaker.description || speaker.bio || ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-[#1A2633]">Related Events</h2>
              <Link
                to="/news"
                className="flex items-center gap-2 px-4 py-2 bg-[#15133D] text-white rounded-lg hover:bg-[#1a1650] transition-colors text-sm font-medium"
              >
                View All
                <ChevronRightIcon style={{ color: "#ffffff" }} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedEvents.map((relatedEvent) => (
                <article
                  key={relatedEvent.id}
                  className="bg-white rounded-[12px] shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => navigate(`/news/${relatedEvent.id}`)}
                >
                  <div className="p-[15px]">
                    <div className="aspect-video overflow-hidden rounded-[12px]">
                      <LazyImage
                        src={relatedEvent.image_url || "/images/Events.png"}
                        alt={relatedEvent.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-[12px]"
                        width="400"
                        height="225"
                      />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-[18px] font-semibold text-[#1A2633] mb-2 line-clamp-2">
                      {relatedEvent.title}
                    </h3>
                    <div className="flex items-center gap-2 text-bible-gold font-medium text-sm mb-4">
                      <CalendarTodayIcon style={{ fontSize: '18px' }} />
                      <span>{formatCardDate(relatedEvent.date, relatedEvent.start_time)}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/news/${relatedEvent.id}`)
                      }}
                      className="text-bible-blue font-medium hover:text-bible-purple transition-colors duration-200 flex items-center gap-1"
                    >
                      View Details
                      <ChevronRightIcon style={{ fontSize: '16px' }} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDetail

