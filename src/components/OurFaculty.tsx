import { useRef, useEffect } from 'react';
import Faculty1 from "../../assets/images/Faculty1.jpeg";
import Faculty2 from "../../assets/images/faculty2.jpeg";
import Faculty3 from "../../assets/images/faculty3.jpeg";
import Faculty4 from "../../assets/images/Faculty4.jpeg";
import Faculty5 from "../../assets/images/Faculty5.jpeg";
import LazyImage from './LazyImage';

const OurFaculty = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const faculty = [
    {
      name: "Rev. John Ruban",
      title: "Director",
      image: Faculty1,
    },
    {
      name: "Pastor. Chinthiya John",
      title: "Principal",
      image: Faculty2,
    },
    {
      name: "Pastor. Moses David",
      title: "Faculty",
      image: Faculty4,
    },
    {
      name: "Pastor. Arun Kumar",
      title: "Faculty",
      image: Faculty5,
    },
    {
      name: "Sis. Shobana",
      title: "Faculty",
      image: Faculty3,
    },
  ];

  // Duplicate faculty array for seamless scrolling
  const duplicatedFaculty = [...faculty, ...faculty, ...faculty];

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    const speed = 0.5;
    let isPaused = false;

    const animate = () => {
      if (!isPaused) {
        scrollPosition += speed;
        if (scrollPosition >= marquee.scrollWidth / 3) {
          scrollPosition = 0;
        }
        marquee.style.transform = `translateX(-${scrollPosition}px)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section className="min-h-[763px] py-16 bg-white relative overflow-hidden flex items-center" aria-labelledby="our-faculty-heading">
      {/* Decorative dots in background - positioned outside carousel */}
      <div
        className="absolute z-0 pointer-events-none"
        style={{ top: '11rem', right: '5rem' }}
      >
        <div className="grid grid-cols-10 gap-2">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-gray-300"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        {/* Section Heading */}
        <div className="text-left mb-12">
          <h2 id="our-faculty-heading" className="text-[38px] font-[700] text-[#333333] mb-3">
            Our Faculty
          </h2>
          <p className="text-[18px] font-[400] text-[#333333]" style={{ lineHeight: '1.3' }}>
            Learn from dedicated mentors who are experts in their fields and
            passionate about your<span className="hidden lg:inline"><br /></span> spiritual and academic growth.
          </p>
        </div>

        {/* Faculty Marquee */}
        <div
          ref={containerRef}
          className="overflow-hidden relative"
        >
          <div
            ref={marqueeRef}
            className="flex gap-6 will-change-transform"
            style={{ width: 'fit-content' }}
          >
            {duplicatedFaculty.map((member, index) => (
              <div key={`${index}-${member.name}`} className="text-left group relative z-10 flex-shrink-0 w-[336px]">
                <div className="relative overflow-hidden rounded-[12px] shadow-lg group-hover:shadow-xl transition-shadow duration-300 h-[407px]">
                  <LazyImage
                    src={member.image}
                    alt={`${member.name} - ${member.title} at God's Will Bible College, experienced faculty mentor`}
                    className={`w-full h-full group-hover:scale-105 transition-transform duration-300 ${(index % 3 === 2) ? 'object-top object-cover' : 'object-cover'
                      }`}
                    width="336"
                    height="407"
                  />

                  {/* Overlay with blur only (no border) */}
                  <div
                    className="absolute bottom-4 left-4 right-4 p-[16px] backdrop-blur-[4.7px] bg-white rounded-[16px]"
                  >
                    <h3 className="text-[20px] font-bold text-[#333333] mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[16px] font-medium text-[#4C4C4C]">
                      {member.title}
                    </p>
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

export default OurFaculty;
