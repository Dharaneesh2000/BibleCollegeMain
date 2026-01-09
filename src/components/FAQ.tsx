import { useState } from 'react'

const FAQ = () => {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set())

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
      className="py-20 lg:py-28 flex items-center"
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
