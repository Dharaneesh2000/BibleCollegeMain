import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import LazyImage from '../components/LazyImage'
import SEO from '../components/SEO'
import Loader from '../components/common/Loader'

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
  speakers: any[] | null
  livestream_available: boolean
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
        let parsedSpeakers = []
        try {
          parsedSpeakers = typeof data.speakers === 'string'
            ? JSON.parse(data.speakers || '[]')
            : (Array.isArray(data.speakers) ? data.speakers : [])
        } catch (e) {
          console.error('Error parsing speakers:', e)
          parsedSpeakers = []
        }

        const parsedData = {
          ...data,
          what_to_expect: typeof data.what_to_expect === 'string'
            ? JSON.parse(data.what_to_expect || '[]')
            : (Array.isArray(data.what_to_expect) ? data.what_to_expect : []),
          speakers: parsedSpeakers,
          livestream_available: data.livestream_available || false
        }
        console.log('Parsed event data:', parsedData)
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
    return <Loader fullScreen message="Loading event..." />
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
    <div className="bg-white font-sans">
      <SEO
        title={`${event.title} - God's Will Bible College`}
        description={eventDescription.substring(0, 160)}
        keywords={`${event.title}, Bible college event, Christian event, ${event.location || 'Rourkela'}, Odisha, theological event`}
        url={eventUrl}
        image={event.hero_image_url || event.image_url || "/images/BannerImage.png"}
        type="article"
      />

      {/* Hero Section */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <LazyImage
          src={event.hero_image_url || event.image_url || "/images/Events.png"}
          alt={event.title}
          className="w-full h-full object-cover"
          width="1920"
          height="500"
        />
        {/* Dark Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(10, 10, 35, 0.2) 0%, rgba(10, 10, 35, 0.6) 50%, rgba(10, 10, 35, 0.9) 100%)'
          }}
        />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 py-8 md:py-12 lg:py-20 px-0 container mx-auto text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight max-w-4xl tracking-tight">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 md:gap-10 text-sm md:text-base font-medium">
            <div className="flex items-center gap-2.5">
              <CalendarTodayIcon className="text-white" style={{ fontSize: '22px' }} />
              <span>{formatDate(event.date)}</span>
            </div>
            {(event.start_time || event.end_time) && (
              <div className="flex items-center gap-2.5">
                <AccessTimeIcon className="text-white" style={{ fontSize: '22px' }} />
                <span>{formatTimeRange(event.start_time, event.end_time)}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2.5">
                <LocationOnIcon className="text-white" style={{ fontSize: '22px' }} />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-0 py-20 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-16 mb-24">

          {/* Left Column: About Event (65%) */}
          <div className="lg:w-[65%]">
            <h2 className="text-[28px] font-bold text-[#333333] mb-8 font-poppins">About this Event</h2>
            <div className="text-[#545454] leading-[1.8] text-[20px] font-normal whitespace-pre-wrap font-poppins">
              {event.about_content || event.description}
            </div>
          </div>

          {/* Right Column: What to Expect (35%) */}
          <div className="lg:w-[35%] space-y-8">
            <div className="bg-white border border-[#E6E6E6] rounded-[20px] p-8 shadow-sm">
              <h3 className="text-[24px] font-bold text-[#1A2633] mb-8 font-poppins">What to Expect</h3>

              {event.what_to_expect && event.what_to_expect.length > 0 ? (
                <div className="space-y-6">
                  {event.what_to_expect.map((item, index) => {
                    const itemObj = item as any
                    const itemTitle = typeof itemObj === 'object' && itemObj?.title ? itemObj.title : item
                    const itemDescription = typeof itemObj === 'object' && itemObj?.description ? itemObj.description : null

                    return (
                      <div key={index} className="flex flex-col gap-4 pb-6 border-b border-[#E6E6E6] last:border-0 last:pb-0">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0284C7]">
                            <FavoriteBorderIcon style={{ fontSize: '20px' }} />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#333333] text-[16px] mb-2 font-poppins">{itemTitle}</h4>
                          {itemDescription && (
                            <p className="text-[#333333] text-[16px] font-normal leading-relaxed font-poppins">{itemDescription}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-[#64748B] italic">Details coming soon...</p>
              )}
            </div>

            {/* Livestream Box */}
            {event.livestream_available && (
              <div className="p-6 bg-[#EFF6FF] rounded-[16px] border border-[#BFDBFE]">
                <h4 className="font-bold text-[#1A2633] mb-2 font-poppins">Livestream Available</h4>
                <p className="text-[#64748B] text-sm leading-relaxed font-poppins">
                  Can't attend in person? Join our livestream online!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Speaker Details */}
        {event.speakers && Array.isArray(event.speakers) && event.speakers.length > 0 && (
          <div className="mb-24">
            <h2 className="text-[28px] font-bold text-[#333333] mb-12 font-poppins">Speaker Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {event.speakers.map((speaker: any, index: number) => (
                <div
                  key={index}
                  className="bg-white border border-[#E6E6E6] rounded-[20px] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-6 relative">
                    <div className="w-[96px] h-[96px] rounded-full overflow-hidden border-[3px] border-white shadow-md">
                      <LazyImage
                        src={speaker.image_url || "/images/SpeakerPlaceholder.png"} // Fallback image needed
                        alt={speaker.name}
                        className="w-full h-full object-cover"
                        width="96"
                        height="96"
                      />
                    </div>
                  </div>
                  <h3 className="text-[20px] font-medium text-[#0A0A0A] mb-3 font-poppins">{speaker.name}</h3>
                  <p className="text-[#4A5565] text-[14px] font-normal leading-relaxed font-poppins max-w-xs">
                    {speaker.description || speaker.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="mb-20">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-[48px] font-bold text-[#333333] font-poppins">Related Events</h2>
              <Link
                to="/news"
                className="px-6 py-2.5 bg-[#15133D] text-white rounded-[8px] text-sm font-semibold hover:bg-[#1a1650] transition-colors"
              >
                View more &gt;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedEvents.map((relatedEvent) => (
                <div
                  key={relatedEvent.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/news/${relatedEvent.id}`)}
                >
                  <div className="rounded-[16px] overflow-hidden mb-5 aspect-[16/9]">
                    <LazyImage
                      src={relatedEvent.image_url || "/images/Events.png"}
                      alt={relatedEvent.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      width="400"
                      height="225"
                    />
                  </div>
                  <h3 className="text-[20px] font-bold text-[#1A2633] mb-3 leading-snug font-poppins group-hover:text-[#15133D] transition-colors">
                    {relatedEvent.title}
                  </h3>
                  <p className="text-[#64748B] text-sm leading-relaxed mb-4 line-clamp-2 font-poppins">
                    {relatedEvent.description}
                  </p>

                  <div className="flex items-center gap-2 text-[#2563EB] font-medium text-sm">
                    <CalendarTodayIcon style={{ fontSize: '18px' }} />
                    <span>{formatCardDate(relatedEvent.date, relatedEvent.start_time)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Begin Your Journey Section (Footer CTA) */}
      <div className="bg-[#0B0A1F] py-24 text-center">
        <div className="container mx-auto px-0">
          <h2 className="text-[36px] md:text-[42px] font-bold text-white mb-4 font-poppins">
            Begin Your Journey with Us
          </h2>
          <p className="text-[#A3A3A3] text-lg max-w-2xl mx-auto mb-10 font-poppins leading-relaxed">
            Whether you're exploring your calling or ready to take the next step, we're here to walk with you. Discover how Grace Bible College can equip you for a lifetime of faithful ministry.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/academics"
              className="px-8 py-3.5 bg-[#FDBA08] text-[#0F0E24] rounded-[8px] font-bold text-[15px] hover:bg-[#e0a507] transition-colors min-w-[180px]"
            >
              Explore Programs
            </Link>
            <button
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-3.5 border border-[#3E3D55] text-white rounded-[8px] font-bold text-[15px] hover:bg-[#1a1835] transition-colors min-w-[180px] flex items-center justify-center gap-2"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
