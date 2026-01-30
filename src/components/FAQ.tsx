import { useState } from 'react'

const FAQ = () => {
  // First FAQ (index 0) is open by default
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0]))

  const faqs = [
    {
      question: "Is previous theological knowledge required for admission?",
      answer: "No, prior theological training is not required. God's Will Bible College welcomes students at all levels of biblical understanding. Our programs are designed to provide a strong foundation in Scripture and theology, whether you are beginning your journey or seeking to deepen existing knowledge. What matters most is a sincere desire to grow in faith, character, and ministry."
    },
    {
      question: "What is the admission process?",
      answer: "The admission process includes: Completing the application form with personal details, educational background, and testimony of faith. A short interview or written statement to understand the applicant's calling, commitment, and readiness for study."
    },
    {
      question: "Are scholarships or financial aid options available?",
      answer: "Yes. God's Will Bible College seeks to make theological education accessible. We offer limited scholarships and financial aid opportunities based on need, merit, and ministry calling. Applicants may apply during the admission process, and awards are prayerfully considered to support students committed to training for life and ministry."
    },
    {
      question: "Is the Bible College affiliated or accredited?",
      answer: "Yes. God's Will Bible College is affiliated with The Word Ministries, UK and accredited by the International Association for Theological Accreditation (IATA). This affiliation and accreditation affirm our commitment to biblically sound and globally respected theological education."
    },
    {
      question: "Do you offer online or distance learning programs?",
      answer: "Yes. God's Will Bible College offers part-time online and distance learning programs designed for students who need flexibility. These programs allow learners to study at their own pace, balance ministry or work commitments, and remain connected to our vibrant community of faith and mission."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndices(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        // If trying to close this FAQ
        // Only allow closing if there's more than one open
        // If this is the only open FAQ, don't close it (ensure at least one is always open)
        if (newSet.size > 1) {
          newSet.delete(index)
        }
      } else {
        // If opening this FAQ, close all others and open only this one
        // This ensures only one FAQ is open at a time
        return new Set<number>([index])
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
        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex justify-between items-start sm:items-center hover:bg-gray-50 transition-colors duration-200 gap-3"
      >
        <span className="font-[600] text-[14px] sm:text-[16px] lg:text-[18px] text-[#333333] flex-1">{faq.question}</span>
        <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
          {isOpen(originalIndex) ? (
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
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
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
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
        <div className="px-4 sm:px-6 pb-3 sm:pb-4">
          <p className="text-[13px] sm:text-[14px] font-[400] text-[#333333] leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  )

  return (
    <section
      className="py-12 sm:py-16 lg:py-20 xl:py-28 flex items-center"
      style={{
        background: 'linear-gradient(181.77deg, #E8E7EC 1.5%, #DBD9FF 147.24%)'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
        {/* Title & Subtitle */}
        <div className="text-left mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-[32px] sm:text-[38px] lg:text-[42px] xl:text-[46px] font-[700] text-[#242424] mb-2 sm:mb-3">FAQ's</h2>
          <p className="text-[13px] sm:text-[14px] font-[400] text-[#4B5563]" style={{ lineHeight: '1.3' }}>
            Everything you need to know about our Bible College, programs, admissions, and life on<span className="hidden lg:inline"><br /></span> campus — all in one place
          </p>
        </div>

        {/* FAQ List - Two independent columns */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 pb-6 sm:pb-8">
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
