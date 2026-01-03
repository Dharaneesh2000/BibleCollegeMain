import LazyImage from './LazyImage'

const HeroSection = () => {
  return (
    <section className="relative w-full" aria-label="Hero banner section">
      {/* Banner Image */}
      <div className="w-full">
        <LazyImage
          src="/images/BannerImage.png" 
          alt="God's Will Bible College - Residential theological education in Rourkela, Odisha for Christian ministry training" 
          className="w-full h-auto object-cover"
          width="1920"
          height="1080"
          loading="eager"
        />
      </div>
    </section>
  )
}

export default HeroSection
