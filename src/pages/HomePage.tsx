import HeroSection from '../components/HeroSection'
import WhyChooseUs from '../components/WhyChooseUs'
import AboutProgram from '../components/AboutProgram'
import OurFaculty from '../components/OurFaculty'
import NewsEvents from '../components/NewsEvents'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import ContactSection from '../components/ContactSection'
import SEO from '../components/SEO'
import { getOrganizationStructuredData, getCollegeStructuredData } from '../utils/seoData'

const HomePage = () => {
  // Combine organization and college structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      getOrganizationStructuredData(),
      getCollegeStructuredData()
    ]
  }

  return (
    <div>
      <SEO
        title="God's Will Bible College - Residential Theological Education in Rourkela, Odisha"
        description="God's Will Bible College is a residential theological institution in Rourkela, Odisha, dedicated to equipping men and women for Christian ministry across India. It combines academic biblical studies with spiritual formation and practical fieldwork in a mission-focused environment. Affordable, community-centric learning experience designed to prepare pastors, evangelists, and missionaries."
        keywords="Bible college, theological education, Christian ministry training, Rourkela, Odisha, India, residential Bible college, theology degree, pastoral training, missionary training, affordable theological education, Bible college India, Christian education Odisha, ministry training, theological seminary, Bible school"
        url="https://godswillbiblecollege.com"
        image="/images/BannerImage.png"
        structuredData={structuredData}
      />
      <HeroSection />
      <WhyChooseUs />
      <AboutProgram />
      <OurFaculty />
      <NewsEvents />
      <Testimonials />
      <FAQ />
      <ContactSection />
    </div>
  )
}

export default HomePage
