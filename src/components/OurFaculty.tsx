import Faculty1 from "../../assets/images/Faculty1.jpeg";
import Faculty2 from "../../assets/images/faculty2.jpeg";
import Faculty3 from "../../assets/images/faculty3.jpeg";
import LazyImage from './LazyImage';

const OurFaculty = () => {
  const faculty = [
    {
      name: "John Ruban",
      title: "HOD",
      image: Faculty1,
    },
    {
      name: "Chinthiya John Ruban",
      title: "Faculty",
      image: Faculty2,
    },
    {
      name: "Shobana Arun Kumar",
      title: "Faculty",
      image: Faculty3,
    },
  ];

  return (
    <section className="min-h-[763px] py-16 bg-white relative overflow-hidden flex items-center" aria-labelledby="our-faculty-heading">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        {/* Section Heading */}
        <div className="text-left mb-12">
          <h2 id="our-faculty-heading" className="text-[38px] font-[700] text-[#333333] mb-5">
            Our Faculty
          </h2>
          <p className="text-[18px] font-[400] text-[#333333] leading-relaxed">
            Learn from dedicated mentors who are experts in their fields and
            passionate about your<span className="hidden lg:inline"><br /></span> spiritual and academic growth.
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative justify-items-center">
          {/* Decorative dots in background */}
          <div
            className="absolute top-0 right-0 z-0 pointer-events-none"
            style={{ transform: "translate(50%, -50%)" }}
          >
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-gray-300"></div>
              ))}
            </div>
          </div>

          {/* Faculty Cards */}
          {faculty.map((member, index) => (
            <div key={index} className="text-left group relative z-10 w-full max-w-[336px]">
              <div className="relative overflow-hidden rounded-[12px] shadow-lg group-hover:shadow-xl transition-shadow duration-300 h-[407px]">
                <LazyImage
                  src={member.image}
                  alt={`${member.name} - ${member.title} at God's Will Bible College, experienced faculty mentor`}
                  className={`w-full h-full group-hover:scale-105 transition-transform duration-300 ${index === 2 ? 'object-top object-cover' : 'object-cover'
                    }`}
                  width="336"
                  height="407"
                />

                {/* Overlay with blur only (no border) */}
                <div
                  className="absolute bottom-4 left-4 right-4 p-[16px] backdrop-blur-[4.7px] bg-white rounded-[16px]"
                >
                  <h3 className="text-[20px] font-bold text-[#333333] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[16px] font-medium text-[#4C4C4C]">
                    {member.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurFaculty;
