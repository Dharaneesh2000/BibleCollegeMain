import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  siteName?: string
  structuredData?: object
}

const SEO = ({
  title = "God's Will Bible College - Residential Theological Education in Rourkela, Odisha",
  description = "God's Will Bible College is a residential theological institution in Rourkela, Odisha, dedicated to equipping men and women for Christian ministry across India. Affordable, mission-focused theological education.",
  keywords = "Bible college, theological education, Christian ministry training, Rourkela, Odisha, India, residential Bible college, theology degree, pastoral training, missionary training, affordable theological education",
  image = "/images/BannerImage.png",
  url = "https://godswillbiblecollege.com",
  type = "website",
  siteName = "God's Will Bible College",
  structuredData
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title

    // Helper function to update or create meta tag
    const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // Update or create meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    
    // Open Graph tags
    updateMetaTag('og:title', title, 'property')
    updateMetaTag('og:description', description, 'property')
    updateMetaTag('og:image', image.startsWith('http') ? image : `${url}${image}`, 'property')
    updateMetaTag('og:url', url, 'property')
    updateMetaTag('og:type', type, 'property')
    updateMetaTag('og:site_name', siteName, 'property')
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image.startsWith('http') ? image : `${url}${image}`)

    // Add structured data if provided
    if (structuredData) {
      // Remove existing structured data script
      const existingScript = document.querySelector('script[type="application/ld+json"]')
      if (existingScript) {
        existingScript.remove()
      }

      // Add new structured data
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(structuredData)
      document.head.appendChild(script)
    }

    // Cleanup function
    return () => {
      // Optionally clean up on unmount if needed
    }
  }, [title, description, keywords, image, url, type, siteName, structuredData])

  return null
}

export default SEO