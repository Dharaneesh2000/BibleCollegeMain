import { useState } from "react";

export interface CourseItem {
  name: string
  credits: number
}

export interface Department {
  name: string
  totalCredits: number
  courses: CourseItem[]
}

interface CurriculumStructureProps {
  departments?: Department[]
}

const CurriculumStructure = ({ departments }: CurriculumStructureProps) => {
  const [expandedDept, setExpandedDept] = useState<number | null>(null);

  if (!departments || departments.length === 0) {
    return null
  }

  const displayDepartments = departments;

  // Calculate Grand Total
  const grandTotal = displayDepartments.reduce((acc, dept) => acc + (Number(dept.totalCredits) || 0), 0);

  return (
    <section
      className="bg-white"
      style={{ paddingTop: "0", paddingBottom: "4rem" }}
    >
      <div className="flex flex-wrap items-center gap-4 mb-5">
        <h2
          className=""
          style={{
            fontSize: "clamp(20px, 1.35vw + 14px, 26px)",
            fontWeight: 700,
            color: "#333333",
            fontFamily: "Montserrat, sans-serif",
            marginBottom: 0
          }}
        >
          Curriculum Structure
        </h2>
        <div
          className="inline-flex items-center px-4 py-1.5 rounded-full"
          style={{
            backgroundColor: "#EFF6FF",
            border: "1px solid #BFDBFE"
          }}
        >
          <span className="text-sm font-semibold text-[#15133D]">
            Grand Total Credits: <span className="text-[#2B7FFF] text-base">{grandTotal}</span>
          </span>
        </div>
      </div>

      <div
        className="rounded-lg"
        style={{
          background: "#F9FAFB",
          padding: "clamp(16px, 1.25vw + 8px, 24px)",
        }}
      >
        <div className="space-y-3 md:space-y-4">
          {displayDepartments.map((dept, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedDept(expandedDept === index ? null : index)
                }
                className="w-full hover:bg-gray-50 transition-colors"
                style={{
                  padding: "clamp(16px, 1.25vw + 8px, 24px)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0 text-left">
                    <h3
                      className="break-words mb-1"
                      style={{
                        fontSize: "clamp(16px, 1.1vw + 10px, 20px)",
                        fontWeight: 600,
                        color: "#333333",
                        fontFamily: "Montserrat, sans-serif",
                        lineHeight: "1.4"
                      }}
                    >
                      {dept.name}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                      Total Credits: <span className="text-[#2B7FFF]">{dept.totalCredits}</span>
                    </p>
                  </div>
                  <svg
                    className={`text-gray-400 transition-transform flex-shrink-0 ${expandedDept === index ? "rotate-180" : ""
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
                </div>
              </button>

              {expandedDept === index && (
                <div
                  className="border-t border-gray-100 bg-[#FAFAFA]"
                  style={{
                    padding: "clamp(16px, 1.25vw + 8px, 24px)",
                  }}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[300px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 bg-gray-50 rounded-tl-lg">Course</th>
                          <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 bg-gray-50 w-24 rounded-tr-lg">Credits</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {dept.courses.map((course, idx) => (
                          <tr key={idx} className="hover:bg-white transition-colors">
                            <td className="py-3 px-4 text-sm text-gray-700 font-medium">{course.name}</td>
                            <td className="py-3 px-4 text-center text-sm text-gray-600 bg-gray-50/50 font-medium">{course.credits}</td>
                          </tr>
                        ))}
                        {/* Footer Row for Total */}
                        <tr className="bg-gray-100/50 border-t border-gray-200">
                          <td className="py-3 px-4 text-sm font-bold text-gray-800 text-right">Department Total</td>
                          <td className="py-3 px-4 text-center text-sm font-bold text-[#2B7FFF] bg-gray-100">{dept.totalCredits}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
