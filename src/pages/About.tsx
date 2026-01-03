import LazyImage from '../components/LazyImage'
import SEO from '../components/SEO'
import BannerImage from '../../assets/images/BannerImage.png'
import MissionVision from '../../assets/images/MissionVision.png'
import MissionVision2 from '../../assets/images/MissionVision(2).png'
import Ourstory1 from '../../assets/images/OurStory1.png'
import OurStory2 from '../../assets/images/OurStory2.png'
import OurStory3 from '../../assets/images/OurStory3.png'
import CampusLifeFacilities1 from '../../assets/images/CampusLifeFacilities1.png'
import CampusLifeFacilities2 from '../../assets/images/CampusLifeFacilities2.png'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined'
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="About Us - God's Will Bible College | Our Mission, Vision & Story"
        description="Learn about God's Will Bible College - our mission to prepare faithful Christian ministers, our vision for global theological excellence, and our inspiring story since 2013."
        keywords="about God's Will Bible College, Bible college mission, theological education vision, Christian ministry training, Bible college history, Rourkela Odisha"
        url="https://godswillbiblecollege.com/about"
        image={BannerImage}
      />

      {/* Banner Section with Gradient Overlay */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <LazyImage
            src={BannerImage}
            alt="About GWBC Banner"
            className="w-full h-full object-cover"
            width="1920"
            height="1080"
            loading="eager"
          />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 w-full h-full bg-black bg-opacity-60 z-[1]" />
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              About GWBC
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Transform your supply chain with AI-powered traceability and blockchain technology
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section 
        className="py-16 md:py-20"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #EAE9FE 100%)'
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] text-center mb-4">
            Our Mission & Vision
          </h2>
          <p className="text-center text-[#636363] mb-12 max-w-2xl mx-auto">
            We are committed to developing servant leaders who will proclaim the Gospel with clarity and engage the world with biblical truth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Mission Card */}
            <div 
              className="bg-white p-8 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-6">
                <LazyImage
                  src={MissionVision}
                  alt="Our Mission - God's Will Bible College"
                  className="object-contain"
                  width="74"
                  height="74"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#333333] mb-4">
                Our Mission
              </h3>
              <p className="text-[#636363] leading-relaxed">
                To prepare and equip men and women for faithful Christian ministry through rigorous theological education, deep spiritual formation, and practical ministry experience. We are committed to developing servant leaders who will proclaim the Gospel with clarity, shepherd God's people with compassion, and engage the world with biblical truth and transformative love.
              </p>
            </div>

            {/* Vision Card */}
            <div 
              className="bg-white p-8 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-6">
                <LazyImage
                  src={MissionVision2}
                  alt="Our Vision - God's Will Bible College"
                  className="object-contain"
                  width="74"
                  height="74"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#333333] mb-4">
                Our Vision
              </h3>
              <p className="text-[#636363] leading-relaxed">
                To be a globally recognized center of theological excellence that produces Spirit-filled, biblically-grounded leaders who will plant churches, advance the Gospel, serve communities, and disciple nations for Christ. We envision a world where our graduates are catalysts for spiritual renewal, social transformation, and Kingdom expansion across every sphere of society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section 
        className="py-16 md:py-20"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #EAE9FE 100%)'
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] text-center mb-4">
            Our Story
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start max-w-5xl mx-auto">
            {/* Left side - Images */}
            <div className="lg:col-span-1 space-y-4">
              <div className="w-full overflow-hidden rounded-[12px]">
                <LazyImage
                  src={Ourstory1}
                  alt="God's Will Bible College Clock Tower - Our Story"
                  className="w-full h-auto object-cover"
                  width="400"
                  height="600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="w-full h-[200px] overflow-hidden rounded-[12px]">
                  <LazyImage
                    src={OurStory2}
                    alt="God's Will Bible College Clock Tower Detail - Our Story"
                    className="w-full h-full object-cover"
                    width="200"
                    height="200"
                  />
                </div>
                <div className="w-full h-[200px] overflow-hidden rounded-[12px]">
                  <LazyImage
                    src={OurStory3}
                    alt="God's Will Bible College Clock Tower Detail - Our Story"
                    className="w-full h-full object-cover"
                    width="200"
                    height="200"
                  />
                </div>
              </div>
            </div>

            {/* Right side - Text Content */}
            <div className="lg:col-span-2">
              <p className="text-[#636363] leading-relaxed text-lg">
                God's Will Bible College was founded in 2013 by Pastor John Ruben, a visionary leader with a heart for equipping the next generation of Christian ministers. After completing his theological studies in Aberdeen, Scotland and Birmingham, England, Pastor John returned to India with a burning passion to raise up leaders who would carry the Gospel to the ends of the earth. Together with his wife, Chinchu, and a dedicated team of faculty members, the college began its journey of providing quality theological education rooted in Scripture and empowered by the Holy Spirit.
              </p>
              <br />
              <p className="text-[#636363] leading-relaxed text-lg">
                Since its inception, God's Will Bible College has trained and graduated over 200 students, many of whom have been ordained as pastors and evangelists. These alumni are now actively serving in various regions, impacting lives and communities through vibrant ministry. From humble beginnings to a thriving institution, the college continues to stand as a beacon of spiritual formation, academic excellence, and missional purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Values Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] text-center mb-4">
            Our Core Values
          </h2>
          <p className="text-center text-[#636363] mb-12 max-w-2xl mx-auto">
            The fundamental principles that guide our institution's curriculum and influence our community's foundation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Global Activity */}
            <div 
              className="bg-white p-6 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-4 flex items-center justify-center w-[60px] h-[60px] rounded-lg" style={{ backgroundColor: '#E3F2FD' }}>
                <PublicOutlinedIcon sx={{ fontSize: 24, color: '#1976D2' }} />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-3">
                Global Activity
              </h3>
              <p className="text-[#636363] leading-relaxed text-sm">
                Engaging with communities worldwide to spread the Gospel and make a global impact through missions and outreach.
              </p>
            </div>

            {/* Student Retention */}
            <div 
              className="bg-white p-6 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-4 flex items-center justify-center w-[60px] h-[60px] rounded-lg" style={{ backgroundColor: '#FFEBEE' }}>
                <FavoriteOutlinedIcon sx={{ fontSize: 24, color: '#D32F2F' }} />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-3">
                Student Retention
              </h3>
              <p className="text-[#636363] leading-relaxed text-sm">
                Creating a supportive environment that nurtures student growth and ensures successful completion of their educational journey.
              </p>
            </div>

            {/* Academic Excellence */}
            <div 
              className="bg-white p-6 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-4 flex items-center justify-center w-[60px] h-[60px] rounded-lg" style={{ backgroundColor: '#FFF9C4' }}>
                <LightbulbOutlinedIcon sx={{ fontSize: 24, color: '#F57F17' }} />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-3">
                Academic Excellence
              </h3>
              <p className="text-[#636363] leading-relaxed text-sm">
                Maintaining high standards in theological education through rigorous curriculum and dedicated faculty commitment.
              </p>
            </div>

            {/* Spirituality */}
            <div 
              className="bg-white p-6 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-4 flex items-center justify-center w-[60px] h-[60px] rounded-lg" style={{ backgroundColor: '#E8F5E9' }}>
                <LocalFloristOutlinedIcon sx={{ fontSize: 24, color: '#388E3C' }} />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-3">
                Spirituality
              </h3>
              <p className="text-[#636363] leading-relaxed text-sm">
                Fostering deep spiritual growth and relationship with God through prayer, worship, and biblical study.
              </p>
            </div>

            {/* Mission-Minded */}
            <div 
              className="bg-white p-6 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-4 flex items-center justify-center w-[60px] h-[60px] rounded-lg" style={{ backgroundColor: '#F3E5F5' }}>
                <StarsOutlinedIcon sx={{ fontSize: 24, color: '#7B1FA2' }} />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-3">
                Mission-Minded
              </h3>
              <p className="text-[#636363] leading-relaxed text-sm">
                Equipping students with a heart for missions and the tools needed to serve in diverse cultural and global contexts.
              </p>
            </div>

            {/* Integrity */}
            <div 
              className="bg-white p-6 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-4 flex items-center justify-center w-[60px] h-[60px] rounded-lg" style={{ backgroundColor: '#E1F5FE' }}>
                <ShieldOutlinedIcon sx={{ fontSize: 24, color: '#0277BD' }} />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-3">
                Integrity
              </h3>
              <p className="text-[#636363] leading-relaxed text-sm">
                Upholding ethical standards and moral principles in all aspects of academic and personal conduct.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accreditation & Affiliation Section */}
      <section 
        className="py-16 md:py-20"
        style={{
          background: 'linear-gradient(153.68deg, #EFF6FF -98.22%, rgba(5, 101, 255, 0.1) 13.44%)'
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] text-center mb-4">
            Accreditation & Affiliation
          </h2>
          <p className="text-center text-[#636363] mb-12 max-w-2xl mx-auto">
            Our commitment to quality through recognized standards in theological training and educational programs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Accredited Institution Card 1 */}
            <div 
              className="bg-white p-8 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-6 flex items-center justify-center w-[80px] h-[80px] rounded-lg" style={{ backgroundColor: '#E3F2FD' }}>
                <BusinessOutlinedIcon sx={{ fontSize: 41, color: '#1976D2' }} />
              </div>
              <h3 className="text-2xl font-bold text-[#333333] mb-4">
                Accredited Institution
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircleIcon sx={{ fontSize: 20, color: '#4CAF50', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                  <span className="text-[#636363]">Internationally recognized programs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon sx={{ fontSize: 20, color: '#4CAF50', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                  <span className="text-[#636363]">Quality assurance in curriculum and teaching</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon sx={{ fontSize: 20, color: '#4CAF50', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                  <span className="text-[#636363]">Regular evaluation and continuous improvement</span>
                </li>
              </ul>
            </div>

            {/* Accredited Institution Card 2 */}
            <div 
              className="bg-white p-8 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-6 flex items-center justify-center w-[80px] h-[80px] rounded-lg" style={{ backgroundColor: '#F3E5F5' }}>
                <SchoolOutlinedIcon sx={{ fontSize: 41, color: '#7B1FA2' }} />
              </div>
              <h3 className="text-2xl font-bold text-[#333333] mb-4">
                Accredited Institution
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircleIcon sx={{ fontSize: 20, color: '#4CAF50', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                  <span className="text-[#636363]">Internationally recognized programs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon sx={{ fontSize: 20, color: '#4CAF50', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                  <span className="text-[#636363]">Quality assurance in curriculum and teaching</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon sx={{ fontSize: 20, color: '#4CAF50', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                  <span className="text-[#636363]">Regular evaluation and continuous improvement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Life & Facilities Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#333333] text-center mb-4">
            Campus Life & Facilities
          </h2>
          <p className="text-center text-[#636363] mb-12 max-w-2xl mx-auto">
            Experience a vibrant community with modern facilities designed to support your academic and spiritual journey.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* State-of-the-Art Library */}
            <div className="bg-white rounded-[12px] overflow-hidden" style={{ border: '1px solid #E6E6E6' }}>
              <div className="w-full h-[300px] overflow-hidden">
                <LazyImage
                  src={CampusLifeFacilities1}
                  alt="State-of-the-Art Library - God's Will Bible College"
                  className="w-full h-full object-cover"
                  width="600"
                  height="300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#333333] mb-3">
                  State-of-the-Art Library
                </h3>
                <p className="text-[#636363] leading-relaxed">
                  Access over 30,000 theological resources and digital databases.
                </p>
              </div>
            </div>

            {/* Chapel & Worship */}
            <div className="bg-white rounded-[12px] overflow-hidden" style={{ border: '1px solid #E6E6E6' }}>
              <div className="w-full h-[300px] overflow-hidden">
                <LazyImage
                  src={CampusLifeFacilities2}
                  alt="Chapel & Worship - God's Will Bible College"
                  className="w-full h-full object-cover"
                  width="600"
                  height="300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#333333] mb-3">
                  Chapel & Worship
                </h3>
                <p className="text-[#636363] leading-relaxed">
                  Regular chapel services and worship gatherings for spiritual growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About