import { useState, useEffect, useRef } from 'react';
import TestimonialsBackground from '../../assets/images/Background.png'
import { supabase } from '../lib/supabase'
import LazyImage from './LazyImage'
import Loader from './common/Loader'

interface Testimonial {
  id: string
  text: string
  author: string
  title: string
  avatar_url: string | null
}

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchTestimonials();
    
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (barRef.current) {
      observer.observe(barRef.current);
    }

    return () => {
      if (barRef.current) {
        observer.unobserve(barRef.current);
      }
    };
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, text, author, title, avatar_url')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxIndex = testimonials.length > 2 ? testimonials.length - 2 : 0; // Show 2 cards at a time on desktop
  const maxIndexMobile = testimonials.length > 1 ? testimonials.length - 1 : 0; // Show 1 card at a time on mobile

  const handlePrev = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : 0);
  };

  const handleNext = () => {
    if (isMobile) {
      setCurrentIndex(prev => prev < maxIndexMobile ? prev + 1 : maxIndexMobile);
    } else {
      setCurrentIndex(prev => prev < maxIndex ? prev + 1 : maxIndex);
    }
  };

  if (loading) {
    return (
      <section
        className="py-16 relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${TestimonialsBackground})`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          minHeight: '100%',
        }}
      >
        <div className="relative container mx-auto px-4">
          <Loader message="Loading testimonials..." textColor="light" />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section
        className="py-16 relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${TestimonialsBackground})`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          minHeight: '100%',
        }}
      >
        <div className="relative container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-white">No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-12 sm:py-16 lg:py-20 xl:py-28 relative overflow-hidden bg-cover bg-center bg-no-repeat flex items-center"
      style={{
        backgroundImage: `url(${TestimonialsBackground})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
      aria-labelledby="testimonials-heading"
    >
      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div
            ref={barRef}
            className="w-[70px] sm:w-[94px] h-[5px] sm:h-[7px] bg-white mb-2 sm:mb-3"
            style={{
              animation: isVisible ? 'barSlideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
              transformOrigin: 'left center'
            }}
            aria-hidden="true"
          ></div>
          <h2 id="testimonials-heading" className="text-[28px] sm:text-[32px] lg:text-[36px] xl:text-[38px] font-[700] mb-2 sm:mb-3 text-white">Testimonials</h2>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <p className="text-[16px] sm:text-[17px] lg:text-[18px] font-[400] text-white flex-1" style={{ lineHeight: '1.3' }}>
              Faith Journeys Shared by Our Graduates: Empowering Leaders, Equipping Servants,<span className="hidden lg:inline"><br /></span> and Impacting Nations for Christ
            </p>
            {/* Navigation arrows */}
            {testimonials.length > 1 && (
              <div className="flex space-x-2 flex-shrink-0 self-start sm:self-auto">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white rounded-full flex items-center justify-center bg-[#ffffff33] hover:bg-[#ffffff55] transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  disabled={isMobile ? currentIndex === maxIndexMobile : currentIndex === maxIndex}
                  className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white rounded-full flex items-center justify-center bg-[#ffffff33] hover:bg-[#ffffff55] transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out cursor-grab active:cursor-grabbing"
            style={{ 
              transform: isMobile 
                ? `translateX(-${currentIndex * 100}%)` 
                : `translateX(-${currentIndex * 51}%)` 
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`flex-shrink-0 w-full sm:w-[49%] ${index === 2 ? 'pr-0' : 'px-2 sm:px-3'}`}
              >
                <div
                  className="p-6 sm:p-8 lg:p-[36px] relative h-full min-h-[280px] sm:min-h-[320px] lg:min-h-[364px] select-none flex flex-col justify-between"
                  style={{
                    borderRadius: '30px 30px 0px 30px',
                    border: '1px solid #FFFFFF',
                    background: '#ffffff1A',
                    boxShadow: '0px 13px 19px 0px #00000012'
                  }}
                >
                  <div>
                    {/* Quote icon */}
                    <div className="mb-3 sm:mb-4">
                      <svg className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] lg:w-[60px] lg:h-[60px] text-[#E7E7E7]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849H0V3h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849H14V3h10z" />
                      </svg>
                    </div>

                    {/* Testimonial text */}
                    <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-normal text-white mb-4 sm:mb-6 leading-relaxed break-words">
                      {testimonial.text}
                    </p>
                  </div>

                  {/* Author info */}
                  <div className="flex items-center">
                    {testimonial.avatar_url ? (
                      <div className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-full mr-3 flex-shrink-0 overflow-hidden">
                        <LazyImage
                          src={testimonial.avatar_url}
                          alt={`${testimonial.author} - ${testimonial.title} testimonial at God's Will Bible College`}
                          className="w-full h-full object-cover"
                          width="48"
                          height="48"
                        />
                      </div>
                    ) : (
                      <div className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] bg-gray-600 rounded-full mr-3 flex-shrink-0 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-base sm:text-lg">
                            {testimonial.author[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                      </div>
                    )}
                    <div>
                      <h4 className="text-[16px] sm:text-[18px] font-medium text-white">{testimonial.author}</h4>
                      <p className="text-gray-300 text-xs sm:text-sm">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
