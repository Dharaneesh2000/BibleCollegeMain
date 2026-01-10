import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LazyImage from './LazyImage';
import Loader from './common/Loader';
import DateEventIcon from '/images/dateevent.svg';

interface NewsEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url: string | null;
  read_more_link: string | null;
  start_time?: string | null;
}

const NewsEvents = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsEvents();
  }, []);

  const fetchNewsEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('news_events')
        .select('id, title, description, date, image_url, read_more_link, start_time')
        .eq('is_active', true)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6); // Limit to 6 items for display

      if (error) throw error;

      if (data && data.length > 0) {
        setNews(data);
      }
    } catch (error) {
      console.error('Error fetching news/events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string, startTime?: string | null) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      
      let formattedDate = `${day} ${month}, ${year}`;
      
      if (startTime) {
        // Format time if provided (assuming it's in HH:MM or HH:MM:SS format)
        const timeParts = startTime.split(':');
        let hours = parseInt(timeParts[0], 10);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedTime = `${hours}:${minutes} ${ampm}`;
        formattedDate += ` | ${formattedTime}`;
      }
      
      return formattedDate;
    } catch {
      return dateString;
    }
  };

  const truncateDescription = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };


  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <Loader message="Loading news and events..." />
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        className="min-h-[821px] py-16 flex items-center"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #EAE9FE 100%)' }}
        aria-labelledby="news-events-heading"
      >
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 id="news-events-heading" className="text-[38px] font-[700] text-[#333333] mb-3">
                Latest News & Events
              </h2>
              <p className="text-[18px] font-[400] text-[#333333]" style={{ lineHeight: '1.3' }}>
                Learn from dedicated mentors who are experts in their fields and passionate about your<span className="hidden lg:inline"><br /></span> spiritual and academic growth.
              </p>
            </div>
            <button
              onClick={() => navigate('/news')}
              className="flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#15133D] text-[12px] font-medium text-[#ffffff] hover:bg-[#1a1650] transition-colors"
            >
              View All <ChevronRightIcon style={{ color: "#ffffff" }} />
            </button>
          </div>

          {news.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No news or events available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-[12px] shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer w-full flex flex-col overflow-hidden"
                  onClick={() => navigate(`/news/${item.id}`)}
                >
                  {/* Image Section with padding - Horizontal rectangle (wider than tall) */}
                  <div className="px-4 pt-4">
                    <div className="w-full h-[180px] overflow-hidden rounded-[8px]">
                      <LazyImage
                        src={item.image_url || "/images/Events.png"}
                        alt={`${item.title} - News and events at God's Will Bible College`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        width="448"
                        height="180"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/Events.png";
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Content Section - Smaller than image */}
                  <div className="px-4 pb-4 pt-3 flex flex-col">
                    {/* Title */}
                    <h3 className="text-[18px] font-bold text-[#333333] mb-2 leading-tight line-clamp-2">
                      {item.title}
                    </h3>
                    
                    {/* Description - Up to 2 rows, max 40 characters */}
                    <p className="text-[14px] font-normal text-[#333333] mb-3 line-clamp-2" style={{ lineHeight: '1.3' }}>
                      {truncateDescription(item.description, 40)}
                    </p>
                    
                    {/* Date and Time */}
                    <div className="flex items-center gap-2">
                      <img 
                        src={DateEventIcon} 
                        alt="Date icon" 
                        className="w-8 h-8 flex-shrink-0"
                        width="32"
                        height="32"
                      />
                      <p className="text-[16px] font-medium" style={{ color: '#044DC2' }}>
                        {formatDate(item.date, item.start_time)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default NewsEvents;
