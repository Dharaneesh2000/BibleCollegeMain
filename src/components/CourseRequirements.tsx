import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

interface Requirement {
  title: string
  icon: string
  bgColor: string
}

interface CourseRequirementsProps {
  requirements?: Requirement[]
}

const CourseRequirements = ({ requirements }: CourseRequirementsProps) => {

  const displayRequirements = requirements?.filter(r => r.title && r.title.trim().length > 0);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "school":
        return <SchoolOutlinedIcon sx={{ fontSize: 28, color: "#155DFC" }} />;
      case "certificate":
        return <WorkspacePremiumOutlinedIcon sx={{ fontSize: 28, color: "#00A63E" }} />;
      case "document":
        return <DescriptionOutlinedIcon sx={{ fontSize: 28, color: "#9810FA" }} />;
      default:
        return <SchoolOutlinedIcon sx={{ fontSize: 28, color: "#155DFC" }} />;
    }
  };

  if (!displayRequirements || displayRequirements.length === 0) {
    return null
  }

  return (
    <section
      className="bg-white"
      style={{ paddingTop: "0", paddingBottom: "4rem" }}
      id="course-requirements"
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
        Course Requirements
      </h2>

      <div style={{ background: "#F9FAFB" }} className="rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayRequirements.map((requirement, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 flex items-center space-x-3"
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: requirement.bgColor,
                }}
              >
                {getIcon(requirement.icon)}
              </div>
              <p
                className="flex-1 h-14 flex items-center break-words"
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#0A0A0A",
                  fontFamily: "Montserrat, sans-serif",
                  lineHeight: "1.4",
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                {requirement.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseRequirements;
