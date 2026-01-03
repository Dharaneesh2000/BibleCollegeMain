import ExpertFaculty from '/images/youtubeDotted.png';

const AboutProgram = () => {
  const highlights = [
    "Biblical Studies & Theology",
    "Pastoral Leadership & Ministry",
    "Worship & Creative Arts",
    "Apologetics & Worldview",
    "Community Development"
  ];

  return (
    <section className="relative text-white overflow-hidden" style={{ backgroundColor: '#15133D' }}>
      {/* Slanted top edge */}
      <div 
        className="absolute top-0 left-0 w-full bg-white z-10" 
        style={{
          height: '100px',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 30%)',
          WebkitClipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 30%)'
        }}
      ></div>
      
      {/* Main content */}
      <div className="relative pt-32 pb-20" style={{ backgroundColor: '#15133D' }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side - Text content */}
            <div className="space-y-8">
              <h2 className="text-[38px] font-[600] text-[#FFFFFF] leading-tight">
                About the Program
              </h2>

              <ul className="space-y-5">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    {/* Tick circle */}
                    <div 
                      className="bg-green-500 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ width: '19.2px', height: '19.2px' }}
                    >
                      <svg 
                        className="w-[11px] h-[11px] text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    {/* Highlight text */}
                    <span className="text-[22px] font-[400] text-[#FFFFFF] leading-snug">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side - Video section */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative aspect-video">
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900"></div>

                  {/* YouTube badge */}
                  <div className="absolute top-5 left-5 z-10">
                    <div className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <span className="font-medium text-sm">Watch video on YouTube</span>
                    </div>
                  </div>

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer shadow-xl">
                      <svg className="w-10 h-10 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative dotted image */}
              <img 
                src={ExpertFaculty} 
                alt="Decorative border" 
                className="absolute -top-5 -right-5 w-24 h-24 pointer-events-none z-20"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutProgram;
