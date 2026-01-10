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
          fontSize: "clamp(20px, 1.35vw + 14px, 26px)",
          fontWeight: 700,
          color: "#333333",
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        Curriculum Structure
      </h2>

      <div 
        className="rounded-lg"
        style={{
          background: "#F9FAFB",
          padding: "clamp(16px, 1.25vw + 8px, 24px)",
        }}
      >
        <div className="space-y-3 md:space-y-4">
          {displayYears.map((yearData, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedYear(expandedYear === index ? null : index)
                }
                className="w-full hover:bg-gray-50 transition-colors"
                style={{
                  padding: "clamp(16px, 1.25vw + 8px, 24px)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div 
                      className="mb-3 text-left"
                      style={{ marginBottom: "clamp(8px, 0.625vw + 4px, 12px)" }}
                    >
                      <span
                        className="text-white rounded-full font-semibold whitespace-nowrap inline-block"
                        style={{ 
                          backgroundColor: yearData.color,
                          padding: "clamp(4px, 0.3125vw + 2px, 6px) clamp(12px, 1.0417vw + 6px, 16px)",
                          fontSize: "clamp(12px, 0.729vw + 8px, 14px)",
                        }}
                      >
                        {yearData.year}
                      </span>
                    </div>
                    <h3
                      className="text-left break-words"
                      style={{
                        fontSize: "clamp(18px, 1.146vw + 12px, 22px)",
                        fontWeight: 600,
                        color: "#333333",
                        fontFamily: "Montserrat, sans-serif",
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        lineHeight: "1.4"
                      }}
                    >
                      {yearData.title || `Year ${index + 1}`}
                    </h3>
                  </div>
                  {yearData.topics && yearData.topics.length > 0 && (
                    <svg
                      className={`text-gray-600 transition-transform flex-shrink-0 ${
                        expandedYear === index ? "rotate-180" : ""
                      }`}
                      style={{
                        width: "clamp(20px, 1.25vw + 10px, 24px)",
                        height: "clamp(20px, 1.25vw + 10px, 24px)",
                      }}
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
                <div 
                  className="border-t border-gray-100"
                  style={{
                    paddingLeft: "clamp(16px, 1.25vw + 8px, 24px)",
                    paddingRight: "clamp(16px, 1.25vw + 8px, 24px)",
                    paddingBottom: "clamp(16px, 1.25vw + 8px, 24px)",
                  }}
                >
                  <ul 
                    className="mt-4"
                    style={{
                      marginTop: "clamp(12px, 1.0417vw + 6px, 16px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "clamp(8px, 0.625vw + 4px, 12px)",
                    }}
                  >
                    {yearData.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-start" style={{ gap: "clamp(8px, 0.625vw + 4px, 12px)" }}>
                        <div 
                          className="bg-blue-600 rounded-full flex-shrink-0"
                          style={{
                            width: "clamp(6px, 0.3125vw + 4px, 6px)",
                            height: "clamp(6px, 0.3125vw + 4px, 6px)",
                            marginTop: "clamp(8px, 0.625vw + 4px, 9px)",
                          }}
                        ></div>
                        <span
                          className="break-words"
                          style={{
                            fontSize: "clamp(16px, 0.9375vw + 10px, 18px)",
                            fontWeight: 500,
                            color: "#333333",
                            fontStyle: "italic",
                            fontFamily: "Montserrat, sans-serif",
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            lineHeight: "1.6"
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
