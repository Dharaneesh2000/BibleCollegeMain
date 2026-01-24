import { useState, useEffect } from 'react'
import LazyImage from './LazyImage'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { supabase } from '../lib/supabase';

interface HeroSlide {
  id: string;
  image_url: string;
  title: string | null;
}

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_carousel')
        .select('id, image_url, title')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setSlides(data);
      } else {
        // Fallback if no images found in DB
        setSlides([{
          id: 'default',
          image_url: '/images/BannerImage.png',
          title: 'God\'s Will Bible College'
        }]);
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      // Fallback on error
      setSlides([{
        id: 'default',
        image_url: '/images/BannerImage.png',
        title: 'God\'s Will Bible College'
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <section className="relative w-full" aria-label="Hero banner loading">
        <div className="w-full h-[660px] border-b-[12px] border-[#1D1C52] bg-gray-200 animate-pulse" />
      </section>
    );
  }

  return (
    <section className="relative w-full group" aria-label="Hero banner carousel">
      {/* Banner Image with specific height and bottom border */}
      <div className="w-full h-[660px] border-b-[12px] border-[#1D1C52] relative overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <LazyImage
              src={slide.image_url}
              alt={slide.title || "God's Will Bible College Banner"}
              className="w-full h-full object-cover"
              width="1920"
              height="660"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />

        {/* Navigation Arrows - Only show if more than 1 slide */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100 duration-300"
              aria-label="Previous slide"
            >
              <ArrowBackIosIcon fontSize="medium" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100 duration-300"
              aria-label="Next slide"
            >
              <ArrowForwardIosIcon fontSize="medium" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/80'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default HeroSection
