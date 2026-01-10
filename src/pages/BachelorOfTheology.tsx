import CourseHero from '../components/CourseHero'
import CourseOverview from '../components/CourseOverview'
import CurriculumStructure from '../components/CurriculumStructure'
import CourseCatalog from '../components/CourseCatalog'
import CourseRequirements from '../components/CourseRequirements'
import ContactSection from '../components/ContactSection'
import EnrollCard from '../components/EnrollCard'

const BachelorOfTheology = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <CourseHero />

      {/* Main content */}
      <div className="relative">
        <div className="container mx-auto px-4">
          {/* Flex layout for 60/40 split */}
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* LEFT SIDE - 60% */}
            <div className="w-full lg:w-[60%]">
              <CourseOverview />
              <CurriculumStructure />
              <CourseCatalog />
              <CourseRequirements />
            </div>

            {/* RIGHT SIDE - 40% */}
            <div className="w-full lg:w-[40%] flex justify-end">
              {/* Sticky Enroll Card - overlaps hero, stops at CourseRequirements */}
              <div className="sticky top-24 self-start -mt-[17rem]">
                <EnrollCard />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Contact Section */}
      <ContactSection />
    </div>
  );
};

export default BachelorOfTheology;