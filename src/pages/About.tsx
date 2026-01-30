import LazyImage from '../components/LazyImage'
import SEO from '../components/SEO'
import AboutUsImage from '../../assets/images/AboutUs.jpeg'
import MissionVision from '../../assets/images/MissionVision.png'
import MissionVision2 from '../../assets/images/MissionVision(2).png'
import Ourstory1 from '../../assets/images/OurStory1.png'
import OurStory2 from '../../assets/images/OurStory2.png'
import OurStory3 from '../../assets/images/OurStory3.png'
import CampusLifeFacilities1 from '../../assets/images/CampusLifeFacilities1.png'
import CampusLifeFacilities2 from '../../assets/images/CampusLifeFacilities2.png'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined'
import LanguageIcon from '@mui/icons-material/Language'
import BOTA from '../../assets/images/icon.svg'
import JourneyFooter from '../components/JourneyFooter'

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="About Us - God's Will Bible College | Our Mission, Vision & Story"
        description="Learn about God's Will Bible College - our mission to prepare faithful Christian ministers, our vision for global theological excellence, and our inspiring story since 2013."
        keywords="about God's Will Bible College, Bible college mission, theological education vision, Christian ministry training, Bible college history, Rourkela Odisha"
        url="https://godswillbiblecollege.com/about"
        image={AboutUsImage}
      />

      {/* Banner Section */}
      <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        <LazyImage
          src={AboutUsImage}
          alt="About GWBC Banner"
          className="w-full h-full object-cover"
          width="1920"
          height="1080"
          loading="eager"
        />
      </section>

      {/* Mission & Vision and Our Story Section - Continuous Background */}
      <section
        className="py-12 sm:py-16 md:py-20 lg:py-24"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #EAE9FE 100%)'
        }}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          {/* Mission & Vision */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <h2
              className="text-[24px] sm:text-[28px] lg:text-[30px] text-[#333333] text-center mb-3 sm:mb-4 font-medium"
            >
              Our Mission & Vision
            </h2>
            <p className="text-center text-[#636363] mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto text-sm sm:text-base px-4">
              The foundational principles that guide our community, shape our curriculum, and define our commitment to excellence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {/* Mission Card */}
              <div
                className="bg-white p-5 sm:p-6 lg:p-8 rounded-[12px]"
                style={{
                  border: '1px solid #E6E6E6'
                }}
              >
                <div className="mb-4 sm:mb-6">
                  <LazyImage
                    src={MissionVision}
                    alt="Our Mission - God's Will Bible College"
                    className="object-contain w-16 h-16 sm:w-20 sm:h-20"
                    width="74"
                    height="74"
                  />
                </div>
                <h3
                  className="text-[#1C398E] mb-3 sm:mb-4 text-lg sm:text-xl lg:text-2xl font-semibold"
                >
                  Our Mission
                </h3>
                <p className="text-[#636363] leading-relaxed text-sm sm:text-base">
                  To prepare and equip men and women for faithful Christian ministry through rigorous theological education, deep spiritual formation, and practical ministry experience. We are committed to developing servant-leaders who will proclaim the Gospel with clarity, shepherd God's people with compassion, and engage the world with biblical truth and transformative love.
                </p>
              </div>

              {/* Vision Card */}
              <div
                className="bg-white p-5 sm:p-6 lg:p-8 rounded-[12px]"
                style={{
                  border: '1px solid #E6E6E6'
                }}
              >
                <div className="mb-4 sm:mb-6">
                  <LazyImage
                    src={MissionVision2}
                    alt="Our Vision - God's Will Bible College"
                    className="object-contain w-16 h-16 sm:w-20 sm:h-20"
                    width="74"
                    height="74"
                  />
                </div>
                <h3
                  className="text-[#59168B] mb-3 sm:mb-4 text-lg sm:text-xl lg:text-2xl font-semibold"
                >
                  Our Vision
                </h3>
                <p className="text-[#636363] leading-relaxed text-sm sm:text-base">
                  To be a globally recognized center of theological excellence that produces Spirit-filled, biblically grounded leaders who will plant churches, advance the Gospel, serve communities, and disciple nations for Christ. We envision a world where our graduates are catalysts for spiritual renewal, social transformation, and kingdom expansion across every sphere of society.
                </p>
              </div>
            </div>
          </div>

          {/* Our Story */}
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {/* Left side - Images */}
              <div className="lg:col-span-1 flex flex-col space-y-3 sm:space-y-4" style={{ height: '100%' }}>
                <div className="w-full flex-1 overflow-hidden rounded-[12px] min-h-[250px] sm:min-h-[300px] lg:min-h-[400px]">
                  <LazyImage
                    src={Ourstory1}
                    alt="God's Will Bible College Clock Tower - Our Story"
                    className="w-full h-full object-cover"
                    width="400"
                    height="600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="w-full h-[150px] sm:h-[180px] lg:h-[200px] overflow-hidden rounded-[12px]">
                    <LazyImage
                      src={OurStory2}
                      alt="God's Will Bible College Clock Tower Detail - Our Story"
                      className="w-full h-full object-cover"
                      width="200"
                      height="200"
                    />
                  </div>
                  <div className="w-full h-[150px] sm:h-[180px] lg:h-[200px] overflow-hidden rounded-[12px]">
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
              <div className="lg:col-span-2 flex flex-col justify-center" style={{ height: '100%' }}>
                <h2
                  className="text-[#333333] mb-3 sm:mb-4 text-2xl sm:text-3xl font-medium text-left"
                >
                  Our Story
                </h2>
                <p className="text-[#636363] leading-relaxed text-sm sm:text-base lg:text-lg">
                  God's Will Bible College was founded in 2013 by Pastor John Ruban, a visionary leader with a heart for equipping the next generation of Christian ministers. After completing his theological studies in Aberdeen, Scotland and Birmingham, England, Pastor John returned to India with a burning passion to raise up leaders who would carry the Gospel to the ends of the earth. Together with his wife, Chinthija, and a dedicated team of faculty members, the college began its journey of providing quality theological education rooted in Scripture and empowered by the Holy Spirit. Since its inception, God's Will Bible College has trained and graduated over 300 students, many of whom have been ordained as pastors and evangelists. These alumni are now actively serving in various regions, impacting lives and communities through vibrant ministry. From humble beginnings to a thriving institution, the college continues to stand as a beacon of spiritual formation, academic excellence, and missional purpose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Values Section */}
      <section className="py-10 sm:py-12 md:py-14 lg:py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            className="text-[#333333] text-center mb-3 sm:mb-4 text-2xl sm:text-3xl font-medium"
          >
            Our Core Values
          </h2>
          <p className="text-center text-[#636363] mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto text-sm sm:text-base px-4">
            The foundational principles that guide our community, shape our curriculum, and define our commitment to excellence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {/* Theological Foundations */}
            <div
              className="bg-white p-4 sm:p-5 lg:p-6 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-3 sm:mb-4 flex items-center justify-center w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-lg" style={{ backgroundColor: '#E3F2FD' }}>
                <MenuBookOutlinedIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: '#1976D2' }} />
              </div>
              <h3
                className="text-[#333333] text-sm sm:text-base font-normal mb-3 sm:mb-4"
              >
                Theological Foundations
              </h3>
              <p
                className="text-[#636363] leading-relaxed text-xs sm:text-sm"
              >
                We submit to the trustworthy Word of God as our final guide for faith, doctrine, and practice.
              </p>
            </div>

            {/* Christ-Centered Focus */}
            <div
              className="bg-white p-4 sm:p-5 lg:p-6 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-3 sm:mb-4 flex items-center justify-center w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-lg" style={{ backgroundColor: '#FFEBEE' }}>
                <FavoriteIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: '#D32F2F' }} />
              </div>
              <h3
                className="text-[#333333] text-sm sm:text-base font-normal mb-3 sm:mb-4"
              >
                Christ-Centered Focus
              </h3>
              <p
                className="text-[#636363] leading-relaxed text-xs sm:text-sm"
              >
                We exalt Jesus Christ—His person, work, and mission—as the heart of all learning and living.
              </p>
            </div>

            {/* Discipleship and Character */}
            <div
              className="bg-white p-4 sm:p-5 lg:p-6 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-3 sm:mb-4 flex items-center justify-center w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-lg" style={{ backgroundColor: '#E8F5E9' }}>
                <PeopleOutlinedIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: '#388E3C' }} />
              </div>
              <h3
                className="text-[#333333] text-sm sm:text-base font-normal mb-3 sm:mb-4"
              >
                Discipleship and Character
              </h3>
              <p
                className="text-[#636363] leading-relaxed text-xs sm:text-sm"
              >
                We train leaders who serve humbly, lead courageously, and steward influence for God's glory.
              </p>
            </div>

            {/* Mission and Service */}
            <div
              className="bg-white p-4 sm:p-5 lg:p-6 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-3 sm:mb-4 flex items-center justify-center w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-lg" style={{ backgroundColor: '#E1F5FE' }}>
                <PublicOutlinedIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: '#0277BD' }} />
              </div>
              <h3
                className="text-[#333333] text-sm sm:text-base font-normal mb-3 sm:mb-4"
              >
                Mission and Service
              </h3>
              <p
                className="text-[#636363] leading-relaxed text-xs sm:text-sm"
              >
                We equip students for evangelism, church planting, and cross-cultural ministry—locally and to the nations.
              </p>
            </div>

            {/* Academic Excellence */}
            <div
              className="bg-white p-4 sm:p-5 lg:p-6 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-3 sm:mb-4 flex items-center justify-center w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-lg" style={{ backgroundColor: '#FFF9C4' }}>
                <SchoolOutlinedIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: '#F57F17' }} />
              </div>
              <h3
                className="text-[#333333] text-sm sm:text-base font-normal mb-3 sm:mb-4"
              >
                Academic Excellence
              </h3>
              <p
                className="text-[#636363] leading-relaxed text-xs sm:text-sm"
              >
                We pursue disciplined study, careful interpretation, and sound theological thinking anchored in Scripture.
              </p>
            </div>

            {/* Stewardship and Accountability */}
            <div
              className="bg-white p-4 sm:p-5 lg:p-6 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-3 sm:mb-4 flex items-center justify-center w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-lg" style={{ backgroundColor: '#E0F2F1' }}>
                <AccountBalanceOutlinedIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: '#00796B' }} />
              </div>
              <h3
                className="text-[#333333] text-sm sm:text-base font-normal mb-3 sm:mb-4"
              >
                Stewardship and Accountability
              </h3>
              <p
                className="text-[#636363] leading-relaxed text-xs sm:text-sm"
              >
                We manage time, gifts, and resources responsibly for the advancement of God's kingdom.
              </p>
            </div>

            {/* Practical Ministry */}
            <div
              className="bg-white p-4 sm:p-5 lg:p-6 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-3 sm:mb-4 flex items-center justify-center w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-lg" style={{ backgroundColor: '#FFF3E0' }}>
                <HandshakeOutlinedIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: '#E65100' }} />
              </div>
              <h3
                className="text-[#333333] text-sm sm:text-base font-normal mb-3 sm:mb-4"
              >
                Practical Ministry
              </h3>
              <p
                className="text-[#636363] leading-relaxed text-xs sm:text-sm"
              >
                We integrate classroom learning with practical ministry opportunities.
              </p>
            </div>

            {/* Church Partnership */}
            <div
              className="bg-white p-4 sm:p-5 lg:p-6 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-3 sm:mb-4 flex items-center justify-center w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-lg" style={{ backgroundColor: '#F3E5F5' }}>
                <BusinessOutlinedIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: '#7B1FA2' }} />
              </div>
              <h3
                className="text-[#333333] text-sm sm:text-base font-normal mb-3 sm:mb-4"
              >
                Church Partnership
              </h3>
              <p
                className="text-[#636363] leading-relaxed text-xs sm:text-sm"
              >
                We strengthen local churches by preparing leaders who serve faithfully.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accreditation & Affiliation Section */}
      <section
        className="py-14 md:py-16"
        style={{
          background: 'linear-gradient(153.68deg, #EFF6FF -98.22%, rgba(5, 101, 255, 0.1) 13.44%)'
        }}
      >
        <div className="container mx-auto max-w-7xl" style={{ paddingLeft: '1.75rem', paddingRight: '1.75rem' }}>
          <h2
            className="text-[#333333] text-center mb-4"
            style={{
              fontSize: '30px',
              fontWeight: 500,
              lineHeight: '30px'
            }}
          >
            Accreditation & Affiliation
          </h2>
          <p className="text-center text-[#636363] mb-12 max-w-2xl mx-auto">
            Our commitment to quality theological education is supported by our esteemed accreditations and affiliations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Accreditation Card */}
            <div
              className="bg-white p-5 sm:p-6 lg:p-8 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-4 sm:mb-6 flex items-center justify-center w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] lg:w-[80px] lg:h-[80px] rounded-lg" style={{ backgroundColor: '#E3F2FD' }}>
                <LazyImage
                  src={BOTA}
                  alt="Accreditation Icon"
                  className="object-contain w-8 h-8 sm:w-10 sm:h-10"
                  width="41"
                  height="41"
                />
              </div>
              <h3
                className="text-[#333333] mb-3 sm:mb-4 text-lg sm:text-xl font-medium"
              >
                Accredited Institution
              </h3>
              <p
                className="text-[#636363] leading-relaxed text-sm sm:text-base lg:text-lg"
              >
                Accredited by the International Association for Theological Accreditation (IATA).
              </p>
            </div>

            {/* Affiliation Card */}
            <div
              className="bg-white p-5 sm:p-6 lg:p-8 rounded-[12px]"
              style={{
                border: '1px solid #E6E6E6'
              }}
            >
              <div className="mb-4 sm:mb-6 flex items-center justify-center w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] lg:w-[80px] lg:h-[80px] rounded-lg" style={{ backgroundColor: '#F3E5F5' }}>
                <LanguageIcon sx={{ fontSize: { xs: 30, sm: 35, lg: 41 }, color: '#7B1FA2' }} />
              </div>
              <h3
                className="text-[#333333] mb-3 sm:mb-4 text-lg sm:text-xl font-medium"
              >
                Affiliated Institution
              </h3>
              <p
                className="text-[#636363] leading-relaxed text-sm sm:text-base lg:text-lg"
              >
                Affiliated with The Word Ministries, Birmingham, England.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Life & Facilities Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <h2
            className="text-2xl sm:text-3xl text-[#333333] text-center mb-3 sm:mb-4 font-medium"
          >
            Campus Life & Facilities
          </h2>
          <p className="text-center text-[#636363] mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Experience a vibrant community with modern facilities designed to support your academic and spiritual journey.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {/* State-of-the-Art Library */}
            <div className="bg-white rounded-[12px] overflow-hidden" style={{ border: '1px solid #E6E6E6' }}>
              <div className="w-full h-[200px] sm:h-[250px] lg:h-[300px] overflow-hidden">
                <LazyImage
                  src={CampusLifeFacilities1}
                  alt="State-of-the-Art Library - God's Will Bible College"
                  className="w-full h-full object-cover"
                  width="600"
                  height="300"
                />
              </div>
              <div className="p-4 sm:p-5 lg:p-6">
                <h3
                  className="text-[#333333] mb-2 sm:mb-3 text-lg sm:text-xl lg:text-2xl font-medium"
                >
                  State-of-the-Art Library
                </h3>
                <p className="text-[#636363] leading-relaxed text-sm sm:text-base">
                  Access over 50,000 theological resources and digital databases.
                </p>
              </div>
            </div>

            {/* Chapel & Worship */}
            <div className="bg-white rounded-[12px] overflow-hidden" style={{ border: '1px solid #E6E6E6' }}>
              <div className="w-full h-[200px] sm:h-[250px] lg:h-[300px] overflow-hidden">
                <LazyImage
                  src={CampusLifeFacilities2}
                  alt="Chapel & Worship - God's Will Bible College"
                  className="w-full h-full object-cover"
                  width="600"
                  height="300"
                />
              </div>
              <div className="p-4 sm:p-5 lg:p-6">
                <h3
                  className="text-[#333333] mb-2 sm:mb-3 text-lg sm:text-xl lg:text-2xl font-medium"
                >
                  Chapel & Worship
                </h3>
                <p className="text-[#636363] leading-relaxed text-sm sm:text-base">
                  Regular chapel services and worship gatherings for spiritual growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Footer */}
      <JourneyFooter />
    </div>
  )
}

export default About