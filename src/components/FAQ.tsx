import { useState } from 'react'

const FAQ = () => {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set())

  const faqs = [
    {
      question: "What programs do you offer?",
      answer: "We offer various theological programs including Bachelor of Theology, Master of Divinity, and specialized certificate programs in biblical studies, pastoral care, and Christian education."
    },
    {
      question: "How can I apply for admission?",
      answer: "You can apply online through our website, download the application form, or contact our admissions office directly. We accept applications throughout the year with specific intake periods."
    },
    {
      question: "What are the admission requirements?",
      answer: "Admission requirements vary by program. Generally, we require a high school diploma or equivalent, transcripts, letters of recommendation, and a personal statement of faith and ministry goals."
    },
    {
      question: "Do you offer scholarships or financial aid?",
      answer: "Yes, we offer various scholarship opportunities and financial aid programs to qualified students. Contact our financial aid office for detailed information about available options."
    },
    {
      question: "What is the duration of the programs?",
      answer: "Program duration varies: Bachelor of Theology is typically 4 years, Master of Divinity is 3 years, and certificate programs range from 6 months to 2 years depending on the specialization."
    },
    {
      question: "How can I contact the admissions office?",
      answer: "You can reach our admissions office by phone at +1 (123) 456-7890, email at admissions@wordbiblecollege.edu, or visit our campus during business hours."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndices(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const isOpen = (index: number) => openIndices.has(index)

  // Split FAQs into two columns
  const leftColumnFAQs = faqs.filter((_, index) => index % 2 === 0)
  const rightColumnFAQs = faqs.filter((_, index) => index % 2 === 1)

  const renderFAQCard = (faq: typeof faqs[0], originalIndex: number) => (
    <div
      key={originalIndex}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{ borderLeft: '3px solid #15133D' }}
    >
      <button
        onClick={() => toggleFAQ(originalIndex)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="font-[600] text-[18px] text-[#333333]">{faq.question}</span>
        <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
          {isOpen(originalIndex) ? (
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          )}
        </div>
      </button>
      {isOpen(originalIndex) && (
        <div className="px-6 pb-4">
          <p className="text-[14px] font-[400] text-[#333333]">{faq.answer}</p>
        </div>
      )}
    </div>
  )

  return (
    <section
      className="py-20 md:py-24"
      style={{
        background: 'linear-gradient(181.77deg, #E8E7EC 1.5%, #DBD9FF 147.24%)'
      }}
    >
      <div className="container mx-auto px-4 pb-8">
        {/* Title & Subtitle */}
        <div className="text-left mb-12">
          <h2 className="text-[46px] font-[700] text-[#242424] mb-5">FAQ's</h2>
          <p className="text-[14px] font-[400] text-[#4B5563] leading-relaxed">
            Everything you need to know about our Bible College, programs, admissions, and life on<span className="hidden lg:inline"><br /></span> campus — all in one place
          </p>
        </div>

        {/* FAQ List - Two independent columns */}
        <div className="flex flex-col md:flex-row gap-6 pb-8">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6">
            {leftColumnFAQs.map((faq, colIndex) => {
              const originalIndex = colIndex * 2
              return renderFAQCard(faq, originalIndex)
            })}
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-6">
            {rightColumnFAQs.map((faq, colIndex) => {
              const originalIndex = colIndex * 2 + 1
              return renderFAQCard(faq, originalIndex)
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
