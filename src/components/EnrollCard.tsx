interface EnrollCardProps {
  title?: string
  duration?: string
  languages?: string
  courseType?: string
  accredited?: boolean
  certificateImageUrl?: string | null
}

const EnrollCard = ({
  title = "Bachelor of Theology (B.Th.)",
  duration = "4 Years",
  languages = "English & Tamil",
  courseType = "Full-time / Residential / On-Campus",
  accredited = true,
  certificateImageUrl
}: EnrollCardProps) => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative max-w-[550px] w-full">
      {/* Single slanted background card */}
      <div 
        className="absolute inset-0 rounded-[23px] transform rotate-6"
        style={{
          background: 'linear-gradient(135deg, #BEDBFF 0%, #E9D4FF 100%)',
          zIndex: 0,
        }}
      />
      
      {/* Main card */}
      <div className="relative bg-white rounded-[11px] shadow-2xl overflow-hidden" style={{ zIndex: 2 }}>
        {/* Certificate image */}
        {certificateImageUrl && (
          <div className="p-6 pb-4">
            <div
              className="relative rounded-lg overflow-hidden"
              style={{
                border: '12px solid #d4a574',
                borderRadius: '8px',
              }}
            >
              <img
                src={certificateImageUrl}
                alt={`${title} Certificate - Accredited theology degree from God's Will Bible College`}
                className="w-full h-auto"
                width="500"
                height="350"
              />
            </div>
          </div>
        )}

        {/* Course details */}
        <div className="px-6 pb-6">
          <div className="space-y-0">
            {/* Title */}
            <div 
              className="flex items-center py-4"
              style={{ borderBottom: '0.47px solid #E6E6E6' }}
            >
              <div className="flex items-center space-x-3" style={{ width: '40%' }}>
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-700">Title</p>
              </div>
              <p className="text-sm text-gray-900 font-medium text-left break-words" style={{ width: '60%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                {title}
              </p>
            </div>

            {/* Duration */}
            {duration && (
              <div 
                className="flex items-center py-4"
                style={{ borderBottom: '0.47px solid #E6E6E6' }}
              >
                <div className="flex items-center space-x-3" style={{ width: '40%' }}>
                  <svg
                    className="w-5 h-5 text-gray-700"
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
                  <p className="text-sm font-medium text-gray-700">Duration:</p>
                </div>
                <p className="text-sm text-gray-900 font-medium text-left break-words" style={{ width: '60%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{duration}</p>
              </div>
            )}

            {/* Languages */}
            {languages && (
              <div 
                className="flex items-center py-4"
                style={{ borderBottom: '0.47px solid #E6E6E6' }}
              >
                <div className="flex items-center space-x-3" style={{ width: '40%' }}>
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                  <p className="text-sm font-medium text-gray-700">Languages</p>
                </div>
                <p className="text-sm text-gray-900 font-medium text-left break-words" style={{ width: '60%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>{languages}</p>
              </div>
            )}

            {/* Course Type */}
            {courseType && (
              <div 
                className="flex items-center py-4"
                style={{ borderBottom: '0.47px solid #E6E6E6' }}
              >
                <div className="flex items-center space-x-3" style={{ width: '40%' }}>
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <p className="text-sm font-medium text-gray-700">Course Type</p>
                </div>
                <p className="text-sm text-gray-900 font-medium text-left break-words" style={{ width: '60%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  {courseType}
                </p>
              </div>
            )}

            {/* Accredited by */}
            <div 
              className="flex items-center py-4"
              style={{ borderBottom: '0.47px solid #E6E6E6' }}
            >
              <div className="flex items-center space-x-3" style={{ width: '40%' }}>
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-medium text-gray-700">Accredited by</p>
              </div>
              <p className="text-sm text-gray-900 font-medium text-left" style={{ width: '60%' }}>
                {accredited ? 'Yes' : 'No'}
              </p>
            </div>
          </div>

          {/* Enroll button */}
          <button
            onClick={scrollToContact}
            className="w-full mt-6 text-white py-3 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: '#15133D' }}
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollCard;
