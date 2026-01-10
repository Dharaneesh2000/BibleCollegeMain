import BiblicalFoundation from '/images/BiblicalFoundation.png';
import GlobalMissionFocus from '/images/GlobalMissionFocus.png';
import VibrantCommunity from '/images/vibrantCommunity.png';
import ExpertFaculty from '/images/ExpertFaculty.png';
import LazyImage from './LazyImage';

const WhyChooseUs = () => {
  const features = [
    {
      icon: BiblicalFoundation,
      title: "Biblical Foundation",
      description: "Grounded in God's inerrant Word, our curriculum equips believers with strong theological foundations for life, ministry, and mission.",
      color: "bg-orange-50"
    },
    {
      icon: GlobalMissionFocus,
      title: "Global Mission",
      description: "Shaped by God's inspired Word, our curriculum builds robust theology and a global mission mindset for impactful life and ministry.",
      color: "bg-[#E7F5E8]"
    },
    {
      icon: VibrantCommunity,
      title: "Vibrant Community",
      description: "Rooted in the Bible, our college fosters worship, mentorship, and mission, cultivating resilient leaders for church and world.",
      color: "bg-[#F0F5FF]"
    },
    {
      icon: ExpertFaculty,
      title: "Expert Faculty",
      description: "Seasoned pastors and theologians offering rigorous, Bible-grounded training with personal guidance that forms character and calling.",
      color: "bg-[#F8EDFF]"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white flex items-center" aria-labelledby="why-choose-us-heading">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Text content */}
          <div>
            <div className="w-[94px] h-[7px] bg-[#012659] mb-6"></div>
            <h2 id="why-choose-us-heading" className="text-[40px] font-bold text-[#333333] leading-tight mb-6">
              Why GWBC is Your <br />Best Choice?
            </h2>
            <p className="text-[16px] font-normal text-[#333333] leading-relaxed">
              Discover an education that informs your mind, transforms your heart, and prepares you for impactful service.
            </p>
          </div>

          {/* Right side - Feature cards in 2x2 grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.color} p-[20px] rounded-[12px] shadow-sm`}
              >
                <div className="mb-4">
                  <LazyImage
                    src={feature.icon}
                    alt={`${feature.title} - ${feature.description.substring(0, 50)}`}
                    className="w-[60px] h-[60px] object-contain rounded-full"
                    width="60"
                    height="60"
                  />
                </div>
                <h3 className="text-[22px] font-semibold text-[#333333] mb-3 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-[16px] font-normal text-[#636363] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
