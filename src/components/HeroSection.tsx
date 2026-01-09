import LazyImage from './LazyImage'

const HeroSection = () => {
  return (
    <section className="relative w-full" aria-label="Hero banner section">
      {/* Banner Image with specific height and bottom border */}
      <div className="w-full h-[660px] border-b-[12px] border-[#1D1C52]">
        <LazyImage
          src="/images/BannerImage.png"
          alt="God's Will Bible College - Residential theological education in Rourkela, Odisha for Christian ministry training"
          className="w-full h-full object-cover"
          width="1920"
          height="660"
          loading="eager"
        />
      </div>
    </section>
  )
}

export default HeroSection
