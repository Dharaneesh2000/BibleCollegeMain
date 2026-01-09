// SEO structured data and metadata helpers

export const getOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "God's Will Bible College",
  "alternateName": "GWBC",
  "url": "https://godswillbiblecollege.com",
  "logo": "https://godswillbiblecollege.com/images/Logo.png",
  "description": "God's Will Bible College is a residential theological institution in Rourkela, Odisha, dedicated to equipping men and women for Christian ministry across India.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Rourkela",
    "addressRegion": "Odisha",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Admissions",
    "areaServed": "IN",
    "availableLanguage": ["English", "Hindi", "Odia"]
  },
  "sameAs": [
    // Add social media links when available
  ]
})

export const getCollegeStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "CollegeOrUniversity",
  "name": "God's Will Bible College",
  "url": "https://godswillbiblecollege.com",
  "logo": "https://godswillbiblecollege.com/images/Logo.png",
  "description": "Residential theological institution in Rourkela, Odisha, offering affordable, mission-focused theological education for Christian ministry across India.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Rourkela",
    "addressRegion": "Odisha",
    "addressCountry": "IN"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "description": "Affordable theological education with scholarship opportunities"
  }
})

export const getCourseStructuredData = (course: {
  title: string
  description: string
  duration?: string | null
  url: string
}) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "name": course.title,
  "description": course.description,
  "provider": {
    "@type": "EducationalOrganization",
    "name": "God's Will Bible College",
    "url": "https://godswillbiblecollege.com"
  },
  "url": course.url,
  "timeRequired": course.duration || "PT4Y",
  "educationalLevel": "Undergraduate",
  "courseCode": course.title.replace(/\s+/g, '-').toLowerCase()
})

export const getBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
})
