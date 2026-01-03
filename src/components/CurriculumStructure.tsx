import { useState } from "react";

interface Year {
  year: string
  title: string
  topics: string[]
  color: string
}

interface CurriculumStructureProps {
  years?: Year[]
}

const CurriculumStructure = ({ years }: CurriculumStructureProps) => {
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  // Default years if none provided
  const defaultYears: Year[] = [
    {
      year: "1st year",
      title: "Foundations of Theology & Scripture",
      topics: [],
      color: "#2B7FFF",
    },
    {
      year: "2nd year",
      title: "Advanced Biblical & Practical Studies",
      topics: [],
      color: "#60A563",
    },
    {
      year: "3rd year",
      title: "Advanced Biblical & Practical Studies",
      topics: [],
      color: "#AD46FF",
    },
    {
      year: "4th year",
      title: "Specialization & Research",
      topics: [],
      color: "#F0B100",
    },
  ];

  const displayYears = years && years.length > 0 ? years : defaultYears;

  if (!displayYears || displayYears.length === 0) {
    return null
  }

  return (
    <section
      className="bg-white"
      style={{ paddingTop: "0", paddingBottom: "4rem" }}
    >
      <h2
        className="mb-5"
        style={{
          fontSize: "26px",
          fontWeight: 700,
          color: "#333333",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        Curriculum Structure
      </h2>

      <div style={{ background: "#F9FAFB" }} className="rounded-lg p-6">
        <div className="space-y-4">
          {displayYears.map((yearData, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedYear(expandedYear === index ? null : index)
                }
                className="w-full p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="mb-3 text-left">
                      <span
                        className="text-white px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap inline-block"
                        style={{ backgroundColor: yearData.color }}
                      >
                        {yearData.year}
                      </span>
                    </div>
                    <h3
                      className="text-left break-words"
                      style={{
                        fontSize: "22px",
                        fontWeight: 600,
                        color: "#333333",
                        fontFamily: "Montserrat, sans-serif",
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {yearData.title || `Year ${index + 1}`}
                    </h3>
                  </div>
                  {yearData.topics && yearData.topics.length > 0 && (
                    <svg
                      className={`w-6 h-6 text-gray-600 transition-transform ${
                        expandedYear === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </div>
              </button>

              {expandedYear === index && yearData.topics && yearData.topics.length > 0 && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <ul className="space-y-3 mt-4">
                    {yearData.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                        <span
                          className="break-words"
                          style={{
                            fontSize: "18px",
                            fontWeight: 500,
                            color: "#333333",
                            fontStyle: "italic",
                            fontFamily: "Montserrat, sans-serif",
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word'
                          }}
                        >
                          {topic}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurriculumStructure;
