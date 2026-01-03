import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LazyImage from './LazyImage';

interface NewsEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url: string | null;
  read_more_link: string | null;
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
        .select('id, title, description, date, image_url, read_more_link')
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  const truncateDescription = (text: string, maxLength: number = 52) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const handleReadMore = (item: NewsEvent, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    navigate(`/news/${item.id}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading news and events...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-white" aria-labelledby="news-events-heading">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 id="news-events-heading" className="text-[38px] font-[700] text-[#333333] mb-5">
                Latest News & Events
              </h2>
              <p className="text-[18px] font-[400] text-[#333333] leading-relaxed">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-[12px] shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => navigate(`/news/${item.id}`)}
                >
                  <div className="p-[15px]">
                    <div className="aspect-video overflow-hidden rounded-[12px]">
                      <LazyImage
                        src={item.image_url || "/images/Events.png"}
                        alt={`${item.title} - News and events at God's Will Bible College`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-[12px]"
                        width="400"
                        height="225"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/Events.png";
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-[18px] font-semibold text-[#1A2633] mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-bible-gold font-medium mb-3">{formatDate(item.date)}</p>
                    <p className="text-[14px] font-normal text-[#333333] mb-4">
                      {truncateDescription(item.description, 52)}
                    </p>
                    <button
                      onClick={(e) => handleReadMore(item, e)}
                      className="text-bible-blue font-medium hover:text-bible-purple transition-colors duration-200 cursor-pointer"
                    >
                      Read More
                    </button>
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
