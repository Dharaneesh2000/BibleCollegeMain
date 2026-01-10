interface CourseOverviewProps {
  content?: string
}

const CourseOverview = ({ content = '' }: CourseOverviewProps) => {
  // Split content by paragraphs (double newlines or single newlines)
  const paragraphs = content ? content.split(/\n\n|\n/).filter(p => p.trim()) : []

  return (
    <section className="bg-white" style={{ paddingTop: '4rem'}}>
      <h2 
        className="mb-5"
        style={{ 
          fontSize: '26px', 
          fontWeight: 700, 
          color: '#333333',
          fontFamily: 'Montserrat, sans-serif'
        }}
      >
        Course Overview
      </h2>
      {paragraphs.length > 0 ? (
        paragraphs.map((paragraph, index) => (
          <p 
            key={index}
            className="mb-12 leading-relaxed break-words"
            style={{ 
              fontSize: '18px', 
              fontWeight: 400, 
              color: '#545454',
              fontFamily: 'Montserrat, sans-serif',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {paragraph.trim()}
          </p>
        ))
      ) : (
        <p 
          className="mb-12 leading-relaxed"
          style={{ 
            fontSize: '18px', 
            fontWeight: 400, 
            color: '#545454',
            fontFamily: 'Montserrat, sans-serif'
          }}
        >
          Course overview information will be available soon.
        </p>
      )}
    </section>
  );
};

export default CourseOverview;
