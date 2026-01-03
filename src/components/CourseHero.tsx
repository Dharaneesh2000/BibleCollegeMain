import AcademicsBackground from "../../assets/images/Background.png";

interface CourseHeroProps {
  title?: string
  description?: string
  durationTag?: string
  formatTag?: string
  degreeTag?: string
}

const CourseHero = ({ 
  title = "Bachelor of theology",
  description = "The Bachelor of Theology (B.Th.) is an undergraduate academic degree focused on the study of Christian theology, biblical studies, church history, and related disciplines.",
  durationTag = "4 years",
  formatTag = "Hybrid",
  degreeTag = "Bachelor of Theology (B.Th.)"
}: CourseHeroProps) => {
  return (
    <section
      className="relative py-20 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${AcademicsBackground})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        minHeight: '100%',
      }}
    >
      {/* Content */}
      <div className="relative mx-auto px-3" style={{ maxWidth: '95%' }}>
        <div className="max-w-4xl">
          <h1 
            className="mb-6"
            style={{ 
              fontSize: '58px', 
              fontWeight: 600, 
              color: '#FFFFFF',
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            {title}
          </h1>
          {description && (
            <p 
              className="mb-8 leading-relaxed"
              style={{ 
                fontSize: '18px', 
                fontWeight: 400, 
                color: '#CFCFCF',
                fontFamily: 'Montserrat, sans-serif'
              }}
            >
              {description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-4">
            {durationTag && (
              <span 
                className="px-4 py-2 rounded-full flex items-center"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#FFFFFF',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                <svg
                  className="w-4 h-4 mr-2"
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
                {durationTag}
              </span>
            )}

            {formatTag && (
              <span 
                className="px-4 py-2 rounded-full"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#FFFFFF',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                {formatTag}
              </span>
            )}

            {degreeTag && (
              <span 
                className="px-4 py-2 rounded-full flex items-center"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#FFFFFF',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                </svg>
                {degreeTag}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseHero;
