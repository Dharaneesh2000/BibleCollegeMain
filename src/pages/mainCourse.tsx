import CourseHero from '../components/CourseHero'
import CourseOverview from '../components/CourseOverview'
import CurriculumStructure from '../components/CurriculumStructure'
import CourseCatalog from '../components/CourseCatalog'
import CourseRequirements from '../components/CourseRequirements'
import ContactSection from '../components/ContactSection'
import EnrollCard from '../components/EnrollCard'

const MainCourse = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <CourseHero />

      {/* Main content */}
      <div className="relative">
        <div className="mx-auto px-1 md:px-2 lg:px-1" style={{ maxWidth: '95%' }}>
          {/* Flex layout for 65/35 split */}
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* LEFT SIDE - 65% */}
            <div className="w-full lg:w-[65%]">
              <CourseOverview />
              <CurriculumStructure />
              <CourseCatalog />
              <CourseRequirements />
            </div>

            {/* RIGHT SIDE - 35% */}
            <div className="w-full lg:w-[35%] flex justify-end pr-4 lg:pr-8">
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

export default MainCourse;