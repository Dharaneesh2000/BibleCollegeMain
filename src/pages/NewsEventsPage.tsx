import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LazyImage from '../components/LazyImage';
import Loader from '../components/common/Loader';

interface NewsEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url: string | null;
  read_more_link: string | null;
}

const NewsEventsPage = () => {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState<NewsEvent[]>([]);
  const [filteredItems, setFilteredItems] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNewsEvents();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, allItems]);

  const fetchNewsEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('news_events')
        .select('id, title, description, date, image_url, read_more_link')
        .eq('is_active', true)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setAllItems(data);
      }
    } catch (error) {
      console.error('Error fetching news/events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...allItems];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const time = date.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `${day} ${month}, ${year} | ${time}`;
    } catch {
      return dateString;
    }
  };

  const handleEventClick = (item: NewsEvent) => {
    navigate(`/news/${item.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <Loader message="Loading events..." />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 pb-6" style={{ borderBottom: '1px solid #E6E6E6' }}>
            <div>
              <h1 className="text-[34px] font-[700] text-[#333333]">
                Events
              </h1>
            </div>
            {/* Search Bar */}
            <div className="relative w-full md:w-auto">
              <SearchIcon 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                style={{ fontSize: '20px' }}
              />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-[300px] pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15133D] focus:border-transparent"
                style={{ border: '0.5px solid #B2B3B7' }}
              />
            </div>
          </div>

          {/* Events Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No events found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-[12px] shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleEventClick(item)}
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
                    <p className="text-[14px] font-normal text-[#333333] mb-4 line-clamp-3">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-bible-gold font-medium text-sm">
                      <CalendarTodayIcon style={{ fontSize: '18px' }} />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsEventsPage;

