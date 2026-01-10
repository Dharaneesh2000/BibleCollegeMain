interface CourseCatalogProps {
  fileUrl?: string | null
  fileName?: string | null
  fileSize?: string | null
}

const CourseCatalog = ({ fileUrl, fileName, fileSize }: CourseCatalogProps) => {
  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank')
    }
  }

  if (!fileUrl) {
    return null // Don't show catalog section if no file
  }

  return (
    <section className="bg-white" style={{ paddingTop: '0', paddingBottom: '4rem' }}>
      <h2 
        className="mb-5"
        style={{ 
          fontSize: '26px', 
          fontWeight: 700, 
          color: '#333333',
          fontFamily: 'Montserrat, sans-serif'
        }}
      >
        Course Catalog
      </h2>

      <div className="rounded-lg p-6 hover:shadow-lg transition-shadow duration-300" style={{ background: '#E8E7EC' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p 
                style={{ 
                  fontSize: '16px', 
                  fontWeight: 500, 
                  color: '#000000',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                {fileName || 'Course Catalog'}
              </p>
              {fileSize && (
                <p 
                  className="mt-0.5"
                  style={{ 
                    fontSize: '12px', 
                    fontWeight: 400, 
                    color: '#000000',
                    fontFamily: 'Montserrat, sans-serif'
                  }}
                >
                  {fileSize}
                </p>
              )}
            </div>
          </div>

          <button 
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-lg transition-colors duration-200 flex items-center space-x-2 flex-shrink-0"
            style={{ 
              backgroundColor: '#030213',
              fontSize: '12px',
              fontWeight: 500,
              color: '#FFFFFF',
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CourseCatalog;
